const express = require("express");
const router = express.Router();
const model = require('../models/orderModel');

router.post('/createConsumerOrder', async (req, res) => {
    let {locationType, orders, locationID} = req.body;
    const consumer_id = req.user.id;

    try {
        for await (let order of orders) {
            let productID = order.id;
            let quantity = order.quantity;
            let total_cost = (order.price_per_product * order.num_products_per_unit) * quantity;

            await model.createConsumerOrder(consumer_id, locationType, locationID, productID, quantity, total_cost);
        }

        res.status(200).send();
    } catch (error) {
        console.log(error);
        res.status(500).json(error.message);
    }
})

router.get('/getOrders/:user_type', async (req, res) => {
    const id = req.user.id;
    const user_type = req.params.user_type;
    try {
        let orders;
        switch (user_type) {
            case 'consumer':
                orders = await model.getConsumerOrders(id);
                break
            case 'supplier':
                orders = await model.getSupplierOrders(id);
                break
            case 'employee':
                orders = await model.getEmployeeOrders(id);
                break
        }

        res.status(200).json(orders);
    } catch (error) {
        console.log(error)
        res.status(500).json(error.message);
    }
})

router.post('/updateOrderStatus', async (req, res) => {
    const {order_id, status} = req.body;
    try {
        await model.updateOrderStatus(order_id, status);
        res.status(204).send();
    } catch (error) {
        console.error(error)
        res.status(500).json(error.message);
    }
})

module.exports = router;