const knex = require("../dbConfig");

async function registerConsumer(
    f_name,
    l_name,
    email,
    password,
    phone,
    company_name
) {
    return knex
        .select("id")
        .from("consumers")
        .where({ email: email })
        .then(function (id) {
            if (id.length === 0)
                return knex("consumers").insert({
                    f_name: f_name,
                    l_name: l_name,
                    email: email,
                    password: password,
                    phone: phone,
                    company_name: company_name,
                });
            else return null;
        });
}

async function registerSupplier(
    f_name,
    l_name,
    email,
    password,
    phone,
    company_name
) {
    return knex
        .select("id")
        .from("suppliers")
        .where({ email: email })
        .then(function (id) {
            if (id.length === 0)
                return knex("suppliers").insert({
                    f_name: f_name,
                    l_name: l_name,
                    email: email,
                    password: password,
                    phone: phone,
                    company_name: company_name,
                });
            else return null;
        });
}

async function registerEmployee(f_name, l_name, email, phone, password, store_id) {
    return knex
        .select("id")
        .from("consumer_employees")
        .where({ email: email })
        .then(function (id) {
            if (id.length === 0)
                return knex("consumer_employees").insert({
                    f_name: f_name,
                    l_name: l_name,
                    email: email,
                    password: password,
                    phone: phone,
                    store_id: store_id
                });
            else return null;
        });
}

module.exports = {
    registerConsumer,
    registerEmployee,
    registerSupplier,
};
