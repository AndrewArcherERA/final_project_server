const express = require("express");
const router = express.Router();
const supplierPageModel = require('../models/supplierPageModel');
const productsModel = require('../models/productsModel')

router.get('/getSuppliers', async (req, res) => {
    try {
        const suppliers = await supplierPageModel.getSuppliers();
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json(error.message);
    }
})

router.get('/getSupplierProds/:id', async (req, res) => {
    try {
        const supplier_id = req.params.id;
        const prods = await productsModel.getAllProducts(supplier_id);
        res.status(200).json(prods);
    } catch (error) {
        res.status(500).json(error.message);
    }
})

module.exports = router;