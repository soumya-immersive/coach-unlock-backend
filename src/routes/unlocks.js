// src/routes/unlocks.js
const express = require('express');
const router = express.Router();
const { unlockCoach } = require('../controllers/unlockController');

router.post('/', unlockCoach);

module.exports = router;
