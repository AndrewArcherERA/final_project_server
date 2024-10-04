const knex = require("../dbConfig");

function getStoredPass(user_type, userID) {
    switch (user_type) {
        case "consumer":
            return knex
                .select("password")
                .from("consumers")
                .where({ id: userID });
        case "supplier":
            return knex
                .select("password")
                .from("suppliers")
                .where({ id: userID });
        case "employee":
            return knex
                .select("password")
                .from("consumer_employees")
                .where({ id: userID });
    }
}

function updatePassword(user_type, userID, newPass) {
    switch (user_type) {
        case "consumer":
            return knex("consumers")
                .where({ id: userID })
                .update({ password: newPass });
        case "supplier":
            return knex("suppliers")
                .where({ id: userID })
                .update({ password: newPass });
        case "employee":
            return knex("consumer_employees")
                .where({ id: userID })
                .update({ password: newPass });
    }
}

function updateUserInfo(
    f_name,
    l_name,
    email,
    phone,
    company_name,
    user_type,
    userID,
) {
    switch (user_type) {
        case "consumer":
            return knex("consumers").where({ id: userID }).update({
                f_name: f_name,
                l_name: l_name,
                email: email,
                phone: phone,
                company_name: company_name,
            });
        case "supplier":
            return knex("suppliers").where({ id: userID }).update({
                f_name: f_name,
                l_name: l_name,
                email: email,
                phone: phone,
                company_name: company_name,
            });
        case "employee":
            return knex("consumer_employees")
                .where({ id: userID })
                .update({
                    f_name: f_name,
                    l_name: l_name,
                    email: email,
                    phone: phone,
                });
    }
}

module.exports = { getStoredPass, updatePassword, updateUserInfo };
