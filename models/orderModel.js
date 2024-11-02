const knex = require('../dbConfig');

function generateExpectedDelivery(dateString, days) {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    date.setDate(date.getDate() + days);

    const newYear = date.getFullYear();
    const newMonth = String(date.getMonth() + 1).padStart(2, '0');
    const newDay = String(date.getDate()).padStart(2, '0');

    return `${newYear}-${newMonth}-${newDay}`;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function createConsumerOrder(consumer_id, locationType, locationID, productID, quantity, total_cost) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const order_date = `${year}-${month}-${day}`

    // Simulates time to fulfil and ship order for demonstration purposes
    const expected_delivery_date = generateExpectedDelivery(order_date, getRandomInt(1, 7))

    if (locationType === 'Warehouse') {
        await knex('orders').insert({
            consumer_id: consumer_id,
            delivery_status: 'ordered',
            order_date: order_date,
            warehouse_location: locationID,
            product_id: productID,
            quantity: quantity,
            total_cost: total_cost,
            expected_delivery_date: expected_delivery_date
        })
    } else {
        await knex('orders').insert({
            consumer_id: consumer_id,
            delivery_status: 'ordered',
            order_date: order_date,
            store_location: locationID,
            product_id: productID,
            quantity: quantity,
            total_cost: total_cost,
            expected_delivery_date: expected_delivery_date
        })
    }
    return knex('products')
        .select('num_units_available')
        .where({id: productID})
        .then(function (current) {
            return knex('products')
                .update({num_units_available: current[0].num_units_available - quantity})
                .where({id: productID})
        })
        .then(function () {
            return knex('consumer_carts')
                .where({consumer_id: consumer_id, product_id: productID})
                .del();
        })


}

function getConsumerOrders(consumer_id) {
    return knex('orders')
        .select(
            'orders.*',
            knex.raw('products.name as productName'),
            knex.raw('consumer_warehouse_locations.street_address as warehouseStreet'),
            knex.raw('consumer_warehouse_locations.city as warehouseCity'),
            knex.raw('consumer_warehouse_locations.state as warehouseState'),
            knex.raw('consumer_warehouse_locations.zip as warehouseZip'),
            knex.raw('consumer_store_locations.street_address as storeStreet'),
            knex.raw('consumer_store_locations.city as storeCity'),
            knex.raw('consumer_store_locations.state as storeState'),
            knex.raw('consumer_store_locations.zip as storeZip'),
        )
        .where('orders.consumer_id', '=', `${consumer_id}`).whereNotNull('delivery_status')
        .leftJoin('products', 'products.id', 'orders.product_id')
        .leftJoin('consumer_warehouse_locations', 'consumer_warehouse_locations.id', 'orders.warehouse_location')
        .leftJoin('consumer_store_locations', 'consumer_store_locations.id', 'orders.store_location')
        .orderBy('orders.id', 'desc');
}

function getSupplierOrders(supplier_id) {
    return knex('products')
        .select('orders.*',
            knex.raw('products.name as productName'),
            knex.raw('consumers.company_name as recipientName'),
            knex.raw('consumer_warehouse_locations.street_address as warehouseStreet'),
            knex.raw('consumer_warehouse_locations.city as warehouseCity'),
            knex.raw('consumer_warehouse_locations.state as warehouseState'),
            knex.raw('consumer_warehouse_locations.zip as warehouseZip'),
            knex.raw('consumer_store_locations.street_address as storeStreet'),
            knex.raw('consumer_store_locations.city as storeCity'),
            knex.raw('consumer_store_locations.state as storeState'),
            knex.raw('consumer_store_locations.zip as storeZip')
        )
        .where({supplier_id: supplier_id})
        .whereNotNull('orders.total_cost')
        .leftJoin('orders', 'orders.product_id', 'products.id')
        .leftJoin('consumers', 'consumers.id', 'orders.consumer_id')
        .leftJoin('consumer_warehouse_locations', 'consumer_warehouse_locations.id', 'orders.warehouse_location')
        .leftJoin('consumer_store_locations', 'consumer_store_locations.id', 'orders.store_location')
        .orderBy('orders.id', 'desc');
}

async function getEmployeeOrders(employee_id) {
    let store_id = await knex('consumer_employees').select("store_id").where({id: employee_id});


    return knex('orders')
        .select(
            'orders.*',
            knex.raw('products.name as productName'),
            knex.raw('consumer_warehouse_locations.street_address as warehouseStreet'),
            knex.raw('consumer_warehouse_locations.city as warehouseCity'),
            knex.raw('consumer_warehouse_locations.state as warehouseState'),
            knex.raw('consumer_warehouse_locations.zip as warehouseZip'),
            knex.raw('consumer_store_locations.street_address as storeStreet'),
            knex.raw('consumer_store_locations.city as storeCity'),
            knex.raw('consumer_store_locations.state as storeState'),
            knex.raw('consumer_store_locations.zip as storeZip'),
        )
        .where('orders.store_location', '=', `${store_id[0].store_id}`).whereNotNull('delivery_status')
        .leftJoin('products', 'products.id', 'orders.product_id')
        .leftJoin('consumer_warehouse_locations', 'consumer_warehouse_locations.id', 'orders.warehouse_location')
        .leftJoin('consumer_store_locations', 'consumer_store_locations.id', 'orders.store_location')
        .orderBy('orders.id', 'desc');
}

async function updateOrderStatus(order_id, status) {
    await knex('orders')
        .update({delivery_status: status})
        .where({id: order_id})

    switch (status) {
        case 'delivered':
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const delivery_date = `${year}-${month}-${day}`
            return knex('orders')
                .update({delivery_date: delivery_date})
                .where({id: order_id})
        case 'received':
            return knex('orders')
                .select('product_id',
                    'quantity',
                    'store_location',
                    'warehouse_location'
                )
                .where({id: order_id})
                .then(async function (data) {
                    if (data[0].warehouse_location) {
                        let inInventory = await knex('products_consumer_inventory')
                            .select('quantity')
                            .where({warehouse_id: data[0].warehouse_location, product_id: data[0].product_id});
                        if (inInventory.length > 0) {
                            let updatedQuantity = inInventory[0].quantity + data[0].quantity;
                            return knex('products_consumer_inventory')
                                .update({quantity: updatedQuantity})
                                .where({
                                    warehouse_id: data[0].warehouse_location,
                                    product_id: data[0].product_id
                                });
                        } else {
                            return knex("products_consumer_inventory")
                                .insert({
                                    warehouse_id: data[0].warehouse_location,
                                    product_id: data[0].product_id,
                                    quantity: data[0].quantity
                                })
                        }
                    } else {
                        let inInventory = await knex('products_consumer_inventory_by_store')
                            .select('quantity')
                            .where({store_id: data[0].store_location, product_id: data[0].product_id});
                        if (inInventory.length > 0) {
                            let updatedQuantity = inInventory[0].quantity + data[0].quantity;
                            return knex('products_consumer_inventory_by_store')
                                .update({quantity: updatedQuantity})
                                .where({
                                    store_id: data[0].store_location,
                                    product_id: data[0].product_id
                                });
                        } else {
                            return knex("products_consumer_inventory_by_store")
                                .insert({
                                    store_id: data[0].store_location,
                                    product_id: data[0].product_id,
                                    quantity: data[0].quantity
                                })
                        }
                    }
                })
    }
}

module.exports = {
    createConsumerOrder,
    getConsumerOrders,
    updateOrderStatus,
    getEmployeeOrders,
    getSupplierOrders,
    generateExpectedDelivery,
    getRandomInt
};