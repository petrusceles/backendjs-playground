const express = require('express');
const router = express.Router();
const product = require('./products');

router.use('/products', product);


module.exports = router;
