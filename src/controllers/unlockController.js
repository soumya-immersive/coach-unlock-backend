const pool = require('../db');

async function unlockCoach(req, res, next) {
    const { userId, coachId } = req.body;
    if (!userId || !coachId) {
        return res.status(400).json({ success: false, message: 'userId and coachId required' });
    }

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // Lock user row FOR UPDATE to avoid race conditions
        const [userRows] = await conn.query('SELECT * FROM users WHERE id = ? FOR UPDATE', [userId]);
        if (userRows.length === 0) {
            await conn.rollback();
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const user = userRows[0];

        const [coachRows] = await conn.query('SELECT * FROM coaches WHERE id = ? FOR UPDATE', [coachId]);
        if (coachRows.length === 0) {
            await conn.rollback();
            return res.status(404).json({ success: false, message: 'Coach not found' });
        }
        const coach = coachRows[0];

        // Check if already unlocked
        const [unlockRows] = await conn.query('SELECT * FROM coach_unlocks WHERE user_id = ? AND coach_id = ?', [userId, coachId]);
        if (unlockRows.length > 0) {
            await conn.rollback();
            return res.status(400).json({ success: false, message: 'Coach already unlocked' });
        }

        if (user.tokens < coach.cost) {
            await conn.rollback();
            return res.status(400).json({ success: false, message: 'Insufficient tokens' });
        }

        // Deduct tokens and add XP
        const newTokens = user.tokens - coach.cost;
        const newXp = user.xp + coach.xp_award;

        await conn.query('UPDATE users SET tokens = ?, xp = ? WHERE id = ?', [newTokens, newXp, userId]);

        // Insert unlock log
        const [insertUnlock] = await conn.query(
            'INSERT INTO coach_unlocks (user_id, coach_id, tokens_spent, xp_awarded) VALUES (?, ?, ?, ?)',
            [userId, coachId, coach.cost, coach.xp_award]
        );

        // Insert xp log
        await conn.query(
            'INSERT INTO xp_logs (user_id, `change`, reason) VALUES (?, ?, ?)',
            [userId, coach.xp_award, `Unlock coach ${coachId}`]
        );


        await conn.commit();

        // Return response indicating red_flag modal should be shown if coach.red_flag == 1
        res.json({
            success: true,
            data: {
                unlockId: insertUnlock.insertId,
                user: { id: userId, tokens: newTokens, xp: newXp },
                coach: { id: coachId, red_flag: !!coach.red_flag },
            },
        });
    } catch (err) {
        await conn.rollback();
        next(err);
    } finally {
        conn.release();
    }
}

module.exports = { unlockCoach };
