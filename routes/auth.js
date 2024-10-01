const express = require("express");
const router = express.Router();
const model = require("../models/authModel");

router.post("/register", async (req, res) => {
    const { f_name, l_name, email, password, phone, company_name, store_id, user_type } =
        req.body;

    let registered;

    try {
        switch (user_type) {
            case "consumer":
                registered = await model.registerConsumer(
                    f_name,
                    l_name,
                    email,
                    password,
                    phone,
                    company_name
                );
                break;
            case "supplier":
                registered = await model.registerSupplier(
                    f_name,
                    l_name,
                    email,
                    password,
                    phone,
                    company_name
                );
                break;
            case "employee":
                registered = await model.registerEmployee(
                    f_name,
                    l_name,
                    email,
                    password,
                    phone, 
                    store_id
                );
                break;
        }

        if (!registered)
            res.status(400).json({
                message: "Email already registered to an account",
            });
        else res.status(201).json({ message: "Account created successfully" });
    } catch (error) {
        res.status(500).json(error.message)
    }
});

module.exports = router;