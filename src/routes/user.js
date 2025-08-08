const express = require('express');
const router = express.Router();
const { getUserById, addTokens } = require('../controllers/userController');

router.get('/:id', getUserById);
router.post('/:id/add-tokens', addTokens);

module.exports = router;
