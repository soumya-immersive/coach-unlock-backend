const pool = require('../db');

// Get User by ID
async function getUserById(req, res, next) {
    const userId = req.params.id;

    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(
            'SELECT id, name, tokens, xp FROM users WHERE id = ?',
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: rows[0]
        });
    } catch (err) {
        next(err);
    } finally {
        conn.release();
    }
}

// Add Tokens to User
async function addTokens(req, res, next) {
    const userId = req.params.id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Amount must be greater than 0'
        });
    }

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        const [rows] = await conn.query(
            'SELECT id, tokens FROM users WHERE id = ? FOR UPDATE',
            [userId]
        );

        if (rows.length === 0) {
            await conn.rollback();
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = rows[0];
        const newTokens = user.tokens + amount;

        await conn.query(
            'UPDATE users SET tokens = ? WHERE id = ?',
            [newTokens, userId]
        );

        await conn.commit();

        res.json({
            success: true,
            message: `Added ${amount} tokens successfully`,
            data: { id: userId, tokens: newTokens }
        });
    } catch (err) {
        await conn.rollback();
        next(err);
    } finally {
        conn.release();
    }
}

module.exports = { getUserById, addTokens };
