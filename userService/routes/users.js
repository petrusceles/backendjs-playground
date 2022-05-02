var express = require('express');
var router = express.Router();
const userRoutes = require('../controllers');

router.get('/', userRoutes.index);
router.get('/:id', userRoutes.show);
router.post('/', userRoutes.register);
router.put('/:id', userRoutes.update);
router.delete('/:id', userRoutes.delete);

module.exports = router;
