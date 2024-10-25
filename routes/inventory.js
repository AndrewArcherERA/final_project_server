const express = require("express");
const router = express.Router();
const model = require('../models/inventoryModel')

router.get('/getInventory/:user_type/:location_id', async (req, res) => {
    try {
        let inventory;
        let user_type = req.params.user_type
        const user_id = req.user.id
        const location_id = req.params.location_id;
        switch (user_type) {
            case 'consumer':
                inventory = await model.getConsumerInventory(user_id, location_id);
                break
            case 'employee':
                inventory = await model.getStoreInventory(user_id, location_id);
                break
        }
        res.status(200).json(inventory)
    } catch (error) {
        console.error(error)
        res.status(500).json(error.message);
    }
})

router.post('/sendToStore', async (req, res) => {
    const {warehouse_id, store_id, product_id, quantity} = req.body;
    const userID = req.user.id;
    try {
        await model.createStoreOrder(userID, warehouse_id, store_id, product_id, quantity);

        res.status(204).send();
    } catch (error) {
        console.log(error)
        res.status(500).json(error.message);
    }
})

// Would be for a product being purchased from a store || a supply being used up in the creation of a sellable product by a store/warehouse
// router.post('/useStoreSupply/:location_id/:product_id', async (req, res) => {
//     const location_id = req.params.location_id;
//     const product_id = req.params.product_id;
//
//     try {
//         let updated = await model.useStoreSupply(location_id, product_id)
//
//     } catch (error) {
//         res.status(500).json(error.message);
//     }
//
// })

module.exports = router;