const express = require('express');
const router = express.Router();

const seller = require('../controllers');

router.get('/', seller.index);
router.get('/:id', seller.detail);
router.post('/', seller.register);
router.put('/:id', seller.update);
router.delete('/:id', seller.delete);

module.exports = router;
