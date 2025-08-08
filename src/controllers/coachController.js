// src/controllers/coachController.js
const pool = require('../db');

async function getCoachesForUser(req, res, next) {
  const userId = parseInt(req.query.userId, 10);
  try {
    const [coaches] = await pool.query(`SELECT c.*, 
      EXISTS(SELECT 1 FROM coach_unlocks u WHERE u.coach_id = c.id AND u.user_id = ?) AS unlocked
      FROM coaches c`, [userId || 0]);
    res.json({ success: true, data: coaches });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCoachesForUser };
