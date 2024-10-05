const knex = require("../dbConfig");

function createStore(
    consumer_id,
    store_name,
    street_address,
    city,
    state,
    zip
) {
    return knex("consumer_store_locations")
        .insert({
            consumer_id: consumer_id,
            name: store_name,
            street_address: street_address,
            city: city,
            state: state,
            zip: zip,
        })
        .then(function () {
            return knex.select("*").from("consumer_store_locations").where({
                consumer_id: consumer_id,
                street_address: street_address,
                city: city,
                state: state,
                zip: zip,
            });
        });
}

function createManagerAccount(
    store_id,
    f_name,
    l_name,
    email,
    password,
    phone
) {
    return knex("consumer_employees")
        .insert({
            store_id: store_id,
            f_name: f_name,
            l_name: l_name,
            email: email,
            password: password,
            phone: phone,
        })
        .then(function () {
            return knex
                .select("*")
                .from("consumer_employees")
                .where({ email: email, password: password });
        });
}

function getStores(consumer_id) {
    return knex
        .select(
            "consumer_store_locations.name",
            "consumer_store_locations.id",
            "consumer_store_locations.street_address",
            "consumer_store_locations.city",
            "consumer_store_locations.state",
            "consumer_store_locations.zip",
            "consumer_employees.f_name",
            "consumer_employees.l_name",
            "consumer_employees.email",
            "consumer_employees.phone",
            knex.raw('consumer_employees.id as employee_id')
        )
        .from("consumer_store_locations")
        .where({consumer_id: consumer_id})
        .leftJoin('consumer_employees', 'consumer_store_locations.id', 'consumer_employees.store_id');
}

module.exports = {
    createStore,
    createManagerAccount,
    getStores,
};
