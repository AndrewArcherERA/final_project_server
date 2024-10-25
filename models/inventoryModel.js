const knex = require('../dbConfig');
const orderModel = require('./orderModel')

function getConsumerInventory(userID, warehouseID) {
    return knex
        .select('products_consumer_inventory.quantity', 'products.name', 'products.id', "suppliers.company_name", 'product_image_links.link')
        .from('products_consumer_inventory')
        .where({warehouse_id: parseInt(warehouseID)})
        .leftJoin('products', 'products.id', 'products_consumer_inventory.product_id')
        .leftJoin('product_image_mapping', 'product_image_mapping.product_id', 'products.id')
        .leftJoin('product_image_links', 'product_image_links.id', 'product_image_mapping.image_id')
        .leftJoin('suppliers', 'suppliers.id', 'products.supplier_id')
        .then(async function (products) {
            const updated = [];
            for (let prod of products) {
                let incomingShipment = await knex('orders')
                    .select('expected_delivery_date', 'quantity')
                    .where({warehouse_location: warehouseID, product_id: prod.id})
                    .andWhere('delivery_status', '!=', 'received')
                    .andWhere('delivery_status', '!=', 'delivered')
                    .andWhere('delivery_status', '!=', 'canceled')
                    .orderBy('expected_delivery_date')
                    .first();

                prod = {
                    ...prod,
                    incomingShipment: incomingShipment
                }
                updated.push(prod);
            }

            return updated;
        })
        .then(async function (products) {
            let ids = await knex('consumer_store_locations')
                .select('id')
                .where({consumer_id: userID})
            return {products: products, storeIDs: ids};
        })
        .then(async function (data) {
            const final = [];
            for (let prod of data.products) {
                const storeQuantities = [];
                for (let store of data.storeIDs) {
                    let storeQuantity = await knex('products_consumer_inventory_by_store')
                        .select('products_consumer_inventory_by_store.quantity', 'consumer_store_locations.name')
                        .where({store_id: store.id, product_id: prod.id})
                        .leftJoin('consumer_store_locations', 'consumer_store_locations.id', 'products_consumer_inventory_by_store.store_id')
                    if (storeQuantity[0]) storeQuantities.push(storeQuantity[0])
                }
                prod = {
                    ...prod,
                    store_quantities: storeQuantities
                }
                final.push(prod);
            }
            return final
        })
}

function getStoreInventory(userID, storeID) {
    return knex('products_consumer_inventory_by_store')
        .select('products_consumer_inventory_by_store.quantity', 'products.name', 'products.id', "suppliers.company_name", 'product_image_links.link')
        .where({store_id: storeID})
        .leftJoin('products', 'products.id', 'products_consumer_inventory_by_store.product_id')
        .leftJoin('product_image_mapping', 'product_image_mapping.product_id', 'products.id')
        .leftJoin('product_image_links', 'product_image_links.id', 'product_image_mapping.image_id')
        .leftJoin('suppliers', 'suppliers.id', 'products.supplier_id')
        .then(async function (products) {
            const updated = [];
            for await (let prod of products) {
                let incomingShipment = await knex('orders')
                    .select('expected_delivery_date', 'quantity', 'consumer_id')
                    .where({store_location: storeID, product_id: prod.id})
                    .andWhere('delivery_status', '!=', 'received')
                    .andWhere('delivery_status', '!=', 'delivered')
                    .andWhere('delivery_status', '!=', 'canceled')
                    .orderBy('expected_delivery_date')
                    .first();

                prod = {
                    ...prod,
                    incomingShipment: incomingShipment
                }
                updated.push(prod);
            }

            return updated;
        })
        .then(async function (products) {
            let consumer_id = await knex('consumer_store_locations')
                .select('consumer_id')
                .where({id: storeID})
            return {products: products, consumer_id: consumer_id[0].consumer_id}
        })
        .then(async function (data) {
            const {products, consumer_id} = data;
            const ids = await knex('consumer_store_locations')
                .select('id')
                .where({consumer_id: consumer_id})
                .whereNot({id: storeID})
            return {products: products, storeIDs: ids};
        })
        .then(async function (data) {
            const prods = [];
            for (let prod of data.products) {
                const storeQuantities = [];
                for (let store of data.storeIDs) {
                    let storeQuantity = await knex('products_consumer_inventory_by_store')
                        .select('products_consumer_inventory_by_store.quantity', 'consumer_store_locations.name')
                        .where({store_id: store.id, product_id: prod.id})
                        .whereNot({id: storeID})
                        .leftJoin('consumer_store_locations', 'consumer_store_locations.id', 'products_consumer_inventory_by_store.store_id')
                    if (storeQuantity[0]) storeQuantities.push(storeQuantity[0])
                }
                let warehouseQuantities = await knex('products_consumer_inventory_by_store')
                    .select('products_consumer_inventory.quantity')
                    .where('products_consumer_inventory.product_id', '=', prod.id)
                    .leftJoin('consumer_store_locations', 'consumer_store_locations.id', 'products_consumer_inventory_by_store.store_id')
                    .leftJoin('consumer_warehouse_locations', 'consumer_warehouse_locations.consumer_id', 'consumer_store_locations.consumer_id')
                    .leftJoin('products_consumer_inventory', 'products_consumer_inventory.warehouse_id', 'consumer_warehouse_locations.id')
                    .first()
                prod = {
                    ...prod,
                    store_quantities: storeQuantities,
                    warehouse_quantity: warehouseQuantities
                }
                prods.push(prod);
            }
            return prods
        })
}

function createStoreOrder(consumer_id, warehouse_id, store_id, product_id, quantity) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const order_date = `${year}-${month}-${day}`;

    const expected_delivery_date = orderModel.generateExpectedDelivery(order_date, orderModel.getRandomInt(1, 3));

    return knex('orders').insert({
        consumer_id: consumer_id,
        store_location: store_id,
        delivery_status: 'ordered',
        order_date: order_date,
        expected_delivery_date: expected_delivery_date,
        quantity: quantity,
        product_id: product_id
    }).then(function () {
        return knex('products_consumer_inventory')
            .select('quantity')
            .where({warehouse_id: warehouse_id, product_id: product_id})
    }).then(function (old_quantity) {
        const newQuantity = (old_quantity[0].quantity - quantity);
        return knex('products_consumer_inventory')
            .update({quantity: newQuantity})
            .where({product_id: product_id});
    })
}

module.exports = {getConsumerInventory, createStoreOrder, getStoreInventory};