const express = require('express');
const router = express.Router();

const user = require('../controllers/user');

router.get('/', user.index);
router.get('/:id', user.show);
router.post('/', user.register);
router.put('/:id', user.update);
router.delete('/:id', user.delete);

module.exports = router;
