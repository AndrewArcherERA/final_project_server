const knex = require('../dbConfig')

function getItems(userID) {
    return knex('consumer_carts')
        .select('products.*', 'consumer_carts.quantity', knex.raw('product_image_links.link as image_link'))
        .where({consumer_id: userID})
        .leftJoin('products', 'consumer_carts.product_id', 'products.id')
        .leftJoin('product_image_mapping', 'products.id', 'product_image_mapping.product_id')
        .leftJoin('product_image_links', 'product_image_mapping.image_id', 'product_image_links.id');
}

function addItem(userID, productID, quantity) {
    return knex('consumer_carts')
        .select('*')
        .where({consumer_id: userID, product_id: productID})
        .then((data) => {
            if (data.length === 0) return knex('consumer_carts').insert({
                consumer_id: userID,
                product_id: productID,
                quantity: quantity
            });
            else return null;
        })
}

function updateQuantity(userID, productID, quantity) {
    return knex('consumer_carts')
        .where({consumer_id: userID, product_id: productID})
        .update({quantity: quantity});
}

function deleteItem(userID, productID) {
    return knex('consumer_carts')
        .where({consumer_id: userID, product_id: productID})
        .del();
}

module.exports = {getItems, addItem, deleteItem, updateQuantity}