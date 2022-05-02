const express = require('express');
const router = express.Router();
const seller = require('./sellers');

router.use('/sellers', seller);

module.exports = router;
