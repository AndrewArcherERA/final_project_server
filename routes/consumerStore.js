const express = require("express");
const router = express.Router();
const model = require("../models/consumerStoreModel");

router.post('/createStore', async (req, res) => {
    try {
        const {consumer_id, store_name, street_address, city, state, zip} = req.body.store;
        const {f_name, l_name, email, password, phone} = req.body.manager;
        let store = await model.createStore(consumer_id, store_name, street_address, city, state, zip);
        console.log(store)
        let store_id = store[0].id;
        let manager = await model.createManagerAccount(store_id, f_name, l_name, email, password, phone);
        console.log(store, manager);
        res.status(201).json({store, manager});
    } catch (error) {
        res.status(500).json(error.message);
    }
})

router.get('/getStores/:consumer_id', async (req, res) => {
    try{
        const {consumer_id}= req.params;
        const stores = await model.getStores(consumer_id);
        let formatted_stores = stores.map((obj) => {
            return obj = {
                store: {
                    id: obj.id,
                    name: obj.name,
                    street_address: obj.street_address,
                    city: obj.city,
                    state: obj.state,
                    zip: obj.zip
                },
                manager: {
                    id: obj.employee_id,
                    f_name: obj.f_name,
                    l_name: obj.l_name,
                    email: obj.email,
                    phone: obj.phone,
                }
            }
        })
        res.status(200).json(formatted_stores);
    } catch (error ) {
        res.status(500).json(error.message);
    }
})

module.exports = router;