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
        const key = ftpModel.createKey('product_images', fileName);
        const url = ftpModel.createURL(key);
        const {num_products_per_unit, num_units_available, price_per_product, name} = req.body;
        const supplier_id = req.user.id;

        await ftpModel.putObjectInBucket(key, fileBody);

        const product = await productsModel.createProduct(num_products_per_unit, num_units_available, price_per_product, name, supplier_id);
        if (!product) {
            res.status(400).json({message: "Cannot have two products with the same name"})
            return
        }
        let image = await productsModel.postImageLink(key, url, product[0].id);


        fs.unlink(filePath, function (err) {
            if (err) return console.log(err);
            console.log('File deleted from server storage successfully');
        });

        res.status(201).json({
            product: {
                id: product[0].id,
                name: product[0].name,
                num_products_per_unit: product[0].num_products_per_unit,
                num_units_available: product[0].num_units_available,
                price_per_product: product[0].price_per_product,
                image_id: image[0].id,
                image_key: image[0].s3_key,
                image_link: image[0].link
            }
        })
    } catch (error) {
        res.status(500).json(error.message);
    }
});

router.get('/getProducts', async (req, res) => {
    try {
        let products = await productsModel.getAllProducts(req.user.id);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json(error.message);
    }
})

router.post('/updateProduct', upload.single("file"), async (req, res) => {
    let filePath, url, key, fileName, fileBody;
    const {old_image_key, name, price_per_product, num_products_per_unit, product_id, old_image_link} = req.body;
    let updatedProduct;

    try {
        if (req.file) {
            filePath = req.file.path;
            fileBody = fs.createReadStream(filePath);
            fileName = req.file.originalname;
            key = ftpModel.createKey('product_images', fileName);
            url = ftpModel.createURL(key);
            await ftpModel.putObjectInBucket(key, fileBody).then(function () {
                return ftpModel.deleteObjectFromBucket(old_image_key);
            });

            fs.unlink(filePath, function (err) {
                if (err) return console.log(err);
                console.log('File deleted from server storage successfully');
            });
            updatedProduct = await productsModel.updateProduct(product_id, num_products_per_unit, price_per_product, name, old_image_key, key, url);
        } else {
            updatedProduct = await productsModel.updateProduct(product_id, num_products_per_unit, price_per_product, name, old_image_key, old_image_key, old_image_link);
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.log(error.message)
        res.status(500).json(error.message);
    }
})

router.put('/updateStock', async (req, res) => {
    try {
        const {product_id, updated_stock} = req.body;

        await productsModel.updateStock(product_id, updated_stock);

        res.status(201).json({message: `Stock updated`})
    } catch (error) {
        res.status(500).json(error.message);
    }
})
module.exports = router;
