const pool = require('../db');

async function getUserHistory(req, res, next) {
    const userId = parseInt(req.params.userId, 10);

    if (!userId) {
        return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    try {
        const [rows] = await pool.query(`
            SELECT 
                cu.id AS unlock_id,
                c.name AS coach_name,
                cu.tokens_spent,
                cu.xp_awarded,
                cu.created_at AS unlocked_at
            FROM coach_unlocks cu
            JOIN coaches c ON cu.coach_id = c.id
            WHERE cu.user_id = ?
            ORDER BY cu.created_at DESC
        `, [userId]);

        res.json({
            success: true,
            data: rows
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { getUserHistory };
