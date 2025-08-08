const express = require('express');
const router = express.Router();
const { getCoachesForUser } = require('../controllers/coachController');

router.get('/', getCoachesForUser);

module.exports = router;
