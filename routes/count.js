const express = require('express');
const router = express.Router();
const knex = require('../dbConfig');

router.put('/increment', async (req, res) => {
    try {
        const response = await knex('counts').where({id: req.body.id}).update({count: req.body.count});
        res.json(response);
    } catch (err) {
        res.status(500).json(err.message);
    }
})


module.exports = router;