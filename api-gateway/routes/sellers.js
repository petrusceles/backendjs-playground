const express = require('express');
const router = express.Router();

const seller = require('../controllers/seller');

router.get('/', seller.index);
router.get('/:id', seller.show);
router.post('/', seller.register);
router.put('/:id', seller.update);
router.delete('/:id', seller.delete);

module.exports = router;
