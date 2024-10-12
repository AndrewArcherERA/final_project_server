const knex = require("../dbConfig");

function createProduct(num_products_per_unit, num_units_available, price_per_product, name, supplier_id) {
    return knex('products')
        .select('*')
        .where({supplier_id: supplier_id, name: name})
        .then(function (product) {
            if (product.length === 0)
                return knex('products').insert({
                    num_products_per_unit: num_products_per_unit,
                    num_units_available: num_units_available,
                    price_per_product: price_per_product,
                    name: name,
                    supplier_id: supplier_id
                }).then(function () {
                    return knex('products').select('*').where({supplier_id: supplier_id, name: name})
                })
            else return null
        })

}

async function postImageLink(key, link, product_id) {
    return knex('product_image_links')
        .insert({s3_key: key, link: link})
        .then(async function (id) {
            const image_id = id[0];
            await knex('product_image_mapping').insert({product_id: product_id, image_id: image_id})
            return image_id;
        })
        .then(function (id) {
            return knex('product_image_links').select('*').where({id: id})
        })
}

async function getAllProducts(supplier_id) {
    try {
        return knex('products')
            .select('products.id',
                'products.num_products_per_unit',
                'products.num_units_available',
                'products.price_per_product',
                'products.name',
                knex.raw('product_image_links.id as image_id'),
                knex.raw('product_image_links.link as image_link'),
                knex.raw('product_image_links.s3_key as image_key'))
            .where({supplier_id: supplier_id})
            .leftJoin('product_image_mapping', 'products.id', 'product_image_mapping.product_id')
            .leftJoin('product_image_links', 'product_image_mapping.image_id', 'product_image_links.id')
            .orderBy('products.id', "desc")

    } catch (error) {
        return error.message;
    }
}

async function updateProduct(product_id, num_products_per_unit, price_per_product, name, old_image_key, new_image_key, new_image_link) {
    return knex('products')
        .where({id: product_id})
        .update({
            num_products_per_unit: num_products_per_unit,
            price_per_product: price_per_product,
            name: name
        })
        .then(function () {
            return knex('product_image_links').where({s3_key: old_image_key})
                .update({
                    s3_key: new_image_key,
                    link: new_image_link
                })
                .then(function () {
                    return knex.select('products.id',
                        'products.num_products_per_unit',
                        'products.num_units_available',
                        'products.price_per_product',
                        'products.name',
                        knex.raw('product_image_links.id as image_id'),
                        knex.raw('product_image_links.link as image_link'),
                        knex.raw('product_image_links.s3_key as image_key'))
                        .from('products')
                        .where('products.id', product_id)
                        .leftJoin('product_image_mapping', 'products.id', 'product_image_mapping.product_id')
                        .leftJoin('product_image_links', 'product_image_mapping.image_id', 'product_image_links.id')
                })
        })

}


module.exports = {createProduct, postImageLink, getAllProducts, updateProduct};
