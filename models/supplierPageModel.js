const knex = require("../dbConfig");

function getSuppliers() {
    return knex('suppliers')
        .select('company_name', 'id')
        .orderBy('company_name');
}

module.exports = {getSuppliers};