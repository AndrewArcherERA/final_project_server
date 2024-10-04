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
        .where({ email: email })
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

async function registerEmployee(
    f_name,
    l_name,
    email,
    phone,
    password,
    store_id
) {
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
                    store_id: store_id,
                });
            else return null;
        });
}

async function signInConsumer(email, password) {
    return knex
        .select("*")
        .from("consumers")
        .where({ email: email })
        .then(function (data) {
            if(data.length > 0){
                const dbPass = data[0].password;
            let isMatch = bcrypt.compareSync(password, dbPass);
            if (!isMatch) return null;
            else {
                const payload = { ...data[0] };
                payload.password = undefined;
                const token = jwt.sign(payload, config.secret);

                const response = {
                    status: "Authenticated",
                    token: token,
                    ...payload
                };

                return response;
            }
            }else return null;
        });
}

async function signInSupplier(email, password) {
    return knex
        .select("*")
        .from("suppliers")
        .where({ email: email })
        .then(function (data) {
            if (data.length > 0) {
                const dbPass = data[0].password;
                let isMatch = bcrypt.compareSync(password, dbPass);
                if (!isMatch) return null;
                else {
                    const payload = { ...data[0] };
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
        .select("*")
        .from("consumer_employees")
        .where({ email: email })
        .then(function (data) {
            if (data.length > 0) {
                const dbPass = data[0].password;
                let isMatch = bcrypt.compareSync(password, dbPass);
                if (!isMatch) return null;
                else {
                    const payload = { ...data[0] };
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
    signInEmployee
};
