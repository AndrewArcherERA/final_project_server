const knex = require("../dbConfig");

function createProduct(num_products_per_unit, num_units_available, price_per_unit, name, supplier_id) {
    return knex('products')
        .select('*')
        .where({supplier_id: supplier_id, name: name})
        .then(function (product) {
            if (product.length === 0)
                return knex('products').insert({
                    num_products_per_unit: num_products_per_unit,
                    num_units_available: num_units_available,
                    price_per_unit: price_per_unit,
                    name: name,
                    supplier_id: supplier_id
                }).then(function () {
                    return knex('products').select('*').where({supplier_id: supplier_id, name: name})
                })
            else return null
        })

}

function postImageLink(key, link, product_id) {
    return knex('product_image_links')
        .insert({s3_key: key, link: link})
        .then(function () {
            return knex('product_image_links').select('id').where({s3_key: key})
        })
        .then(function (id) {
            const image_id = id[0].id;
            return knex('product_image_mapping').insert({product_id: product_id, image_id: image_id})
        })
        .then(function () {
            return knex('product_image_links').select('*').where({s3_key: key})
        })
}

module.exports = {createProduct, postImageLink};
