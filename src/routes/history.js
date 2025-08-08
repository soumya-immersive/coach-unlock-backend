const express = require('express');
const router = express.Router();
const { getUserHistory } = require('../controllers/historyController');

router.get('/:userId', getUserHistory);

module.exports = router;
