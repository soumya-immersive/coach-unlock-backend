const express = require('express');
const router = express.Router();
const unlockController = require('../controllers/unlockController');

// POST /api/unlock
router.post('/', unlockController.unlockCoach);

module.exports = router;
