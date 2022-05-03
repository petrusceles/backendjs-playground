const express = require('express');
const router = express.Router();
const product = require('../controllers');

router.get('/', product.index);
router.get('/:id', product.show);
router.post('/', product.register);
router.put('/:id', product.update);
router.delete('/:id', product.delete);

module.exports = router;
