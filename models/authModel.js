const knex = require("../dbConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../auth.config");

async function registerConsumer(
    f_name,
    l_name,
    email,
    password,
    phone,
    company_name
) {
    const salt = bcrypt.genSaltSync(10);
    let hashedPass = bcrypt.hashSync(password, salt);
    return knex
        .select("id")
        .from("consumers")
        .where({email: email})
        .then(function (id) {
            if (id.length === 0)
                return knex("consumers").insert({
                    f_name: f_name,
                    l_name: l_name,
                    email: email,
                    password: hashedPass,
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
    const salt = bcrypt.genSaltSync(10);
    let hashedPass = bcrypt.hashSync(password, salt);
    return knex
        .select("id")
        .from("suppliers")
        .where({email: email})
        .then(function (id) {
            if (id.length === 0)
                return knex("suppliers").insert({
                    f_name: f_name,
                    l_name: l_name,
                    email: email,
                    password: hashedPass,
                    phone: phone,
                    company_name: company_name,
                });
            else return null;
        });
}

async function registerEmployee(
    f_name,
    l_name,
    email,
    phone,
    password,
    store_id
) {
    const salt = bcrypt.genSaltSync(10);
    let hashedPass = bcrypt.hashSync(password, salt);
    return knex
        .select("id")
        .from("consumer_employees")
        .where({email: email})
        .then(function (id) {
            if (id.length === 0)
                return knex("consumer_employees").insert({
                    f_name: f_name,
                    l_name: l_name,
                    email: email,
                    password: hashedPass,
                    phone: phone,
                    store_id: store_id,
                });
            else return null;
        });
}

async function signInConsumer(email, password) {
    return knex
        .select("consumers.*", knex.raw('consumer_warehouse_locations.id as warehouse_id'))
        .from("consumers")
        .where({email: email})
        .leftJoin('consumer_warehouse_locations', 'consumer_warehouse_locations.consumer_id', 'consumers.id')
        .then(function (data) {
            if (data.length > 0) {
                const dbPass = data[0].password;
                let isMatch = bcrypt.compareSync(password, dbPass);
                if (!isMatch) return null;
                else {
                    const payload = {...data[0]};
                    payload.password = undefined;
                    const token = jwt.sign(payload, config.secret);

                    const response = {
                        status: "Authenticated",
                        token: token,
                        ...payload,
                    };

                    return response;
                }
            } else return null;
        });
}

async function signInSupplier(email, password) {
    return knex
        .select("*")
        .from("suppliers")
        .where({email: email})
        .then(function (data) {
            if (data.length > 0) {
                const dbPass = data[0].password;
                let isMatch = bcrypt.compareSync(password, dbPass);
                if (!isMatch) return null;
                else {
                    const payload = {...data[0]};
                    payload.password = undefined;
                    const token = jwt.sign(payload, config.secret);

                    const response = {
                        status: "Authenticated",
                        token: token,
                        ...payload,
                    };

                    return response;
                }
            } else return null;
        });
}

async function signInEmployee(email, password) {
    return knex
        .select("consumer_employees.*",
            knex.raw('consumer_store_locations.name as storeName'),
            'consumer_store_locations.city',
            'consumer_store_locations.street_address',
            'consumer_store_locations.state',
            'consumer_store_locations.zip',
            'consumers.company_name'
        )
        .from("consumer_employees")
        .where('consumer_employees.email', '=', email)
        .leftJoin('consumer_store_locations', 'consumer_employees.store_id', 'consumer_store_locations.id')
        .leftJoin('consumers', 'consumer_store_locations.consumer_id', 'consumers.id')
        .then(function (data) {
            if (data.length > 0) {
                const dbPass = data[0].password;
                let isMatch = bcrypt.compareSync(password, dbPass);
                if (!isMatch) return null;
                else {
                    const payload = {...data[0]};
                    payload.password = undefined;
                    const token = jwt.sign(payload, config.secret);

                    const response = {
                        status: "Authenticated",
                        token: token,
                        ...payload,
                    };

                    return response;
                }
            } else return null;
        });
}

module.exports = {
    registerConsumer,
    registerEmployee,
    registerSupplier,
    signInConsumer,
    signInSupplier,
    signInEmployee,
};
