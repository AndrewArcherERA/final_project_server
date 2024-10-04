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

router.post('/signIn', async (req, res) => {
    const {email, password, user_type} = req.body;

    let creds;
    try{
        switch(user_type){
            case 'consumer':
                creds = await model.signInConsumer(email, password);
                break;
            case 'supplier':
                creds = await model.signInSupplier(email, password);
                break;
            case 'employee': 
                creds = await model.signInEmployee(email, password);
        }

        if(!creds) res.status(401).json({message: 'Wrong email or password'})
        else res.status(200).json(creds);
    } catch (error) {
        res.status(500).json(error.message);
    }   
})

module.exports = router;
