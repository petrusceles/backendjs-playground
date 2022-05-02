var express = require('express');
var router = express.Router();
const user = require('./users')

router.use('/users', user);

module.exports = router;
