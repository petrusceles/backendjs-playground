const express = require('express');
const router = express.Router();
const user = require('./users');
const seller = require('./sellers');
const product = require('./products');

router.use('/users',user);
router.use('/sellers',seller);
router.use('/products',product);


module.exports = router;
