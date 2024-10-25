const express = require("express");
const router = express.Router();
const model = require('../models/cartModel');

router.get('/getCartItems', async (req, res) => {
    try {
        const userID = req.user.id;

        const items = await model.getItems(userID);

        res.status(200).json(items);
    } catch (error) {
        res.status(500).json(error.message);
    }
})

router.post('/addCartItem', async (req, res) => {
    const {userID, productID, quantity} = req.body;

    const item = await model.addItem(userID, productID, quantity);

    if (!item) {
        res.status(400).json({message: 'Item already in cart'}).send();
    } else res.status(201).json(item);
})

router.delete('/deleteCartItem/:productID', async (req, res) => {
    const productID = req.params.productID;
    const userID = req.user.id;

    try {
        await model.deleteItem(userID, productID);

        res.status(204).send();
    } catch (error) {
        res.status(500).json(error.message);
    }

})

router.post('/updateQuantity', async (req, res) => {
    const {productID, quantity} = req.body;
    const userID = req.user.id;

    try {
        await model.updateQuantity(userID, productID, quantity);

        res.status(204).send();
    } catch (error) {
        res.status(500).json(error.message);
    }

})
module.exports = router;