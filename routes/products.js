const express = require("express");
const router = express.Router();
const productsModel = require("../models/productsModel");
const ftpModel = require("../models/ftpModel");
const multer = require("multer");
const fs = require("fs");
const upload = multer({dest: "uploads/"});

router.post("/createProduct", upload.single("file"), async (req, res) => {
    try {
        const filePath = req.file.path;
        const fileBody = fs.createReadStream(filePath);
        const fileName = req.file.originalname;
        const key = ftpModel.createKey('documents', fileName);
        const url = ftpModel.createURL(key);
        const {num_products_per_unit, num_units_available, price_per_unit, name, supplier_id} = req.body;

        await ftpModel.putObjectInBucket(key, fileBody);

        const product = await productsModel.createProduct(num_products_per_unit, num_units_available, price_per_unit, name, supplier_id);
        if (!product) res.status(400).json({message: "Cannot have two products with the same name"})
        let image;
        if (req.file) image = await productsModel.postImageLink(key, url, product[0].id);

        res.status(201).json({
            product,
            image
        })

        fs.unlink(filePath, function (err) {
            if (err) return console.log(err);
            console.log('File deleted from server storage successfully');
        });

    } catch (error) {
        res.status(500).json(error.message);
    }
});

module.exports = router;
