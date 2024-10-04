const express = require("express");
const router = express.Router();
const model = require("../models/accountModel");

router.get("/getStoredPass/:type/:id", async (req, res) => {
    try {
        const { type, id } = req.params;
        const pass = await model.getStoredPass(type, id);
        res.status(200).json(pass);
    } catch (error) {
        res.status(500).json(error.message);
    }
});

router.put("/updatePassword", async (req, res) => {
    try {
        const { user_type, userID, newPass } = req.body;
        const updated = await model.updatePassword(user_type, userID, newPass);
        res.status(205).send();
    } catch (error) {
        res.status(500).json(error.message);
    }
});

router.put("/updateUserInfo", async (req, res) => {
    try {
        const {
            f_name,
            l_name,
            email,
            phone,
            company_name,
            userID,
            user_type,
        } = req.body;
        await model
            .updateUserInfo(
                f_name,
                l_name,
                email,
                phone,
                company_name,
                user_type,
                userID
            )
            .then(function () {
                res.status(200).json({
                    f_name: f_name,
                    l_name: l_name,
                    email: email,
                    phone: phone,
                    company_name: company_name
                })
            });
    } catch (error) {
        res.status(500).json(error.message);
    }
});

module.exports = router;
