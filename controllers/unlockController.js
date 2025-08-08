const pool = require('../db');

/**
 * Expected request body:
 * {
 *   playerId: number,
 *   coachId: number
 * }
 */
exports.unlockCoach = async (req, res) => {
  const { playerId, coachId } = req.body;
  if (!playerId || !coachId) {
    return res.status(400).json({ error: 'playerId and coachId required' });
  }

  const TOKENS_REQUIRED = 10;
  const XP_AWARDED = 5;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Get player tokens/xp and coach data (red_flag)
    const [playerRows] = await conn.query('SELECT id, tokens, xp FROM players WHERE id = ?', [playerId]);
    if (playerRows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ error: 'Player not found' });
    }
    const player = playerRows[0];

    const [coachRows] = await conn.query('SELECT id, name, red_flag FROM coaches WHERE id = ?', [coachId]);
    if (coachRows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ error: 'Coach not found' });
    }
    const coach = coachRows[0];

    // Check if player already unlocked this coach
    const [unlockExists] = await conn.query(
      'SELECT id FROM unlocks WHERE player_id = ? AND coach_id = ?',
      [playerId, coachId]
    );
    if (unlockExists.length > 0) {
      await conn.rollback();
      return res.status(409).json({ error: 'Coach already unlocked' });
    }

    // Check tokens
    if (player.tokens < TOKENS_REQUIRED) {
      await conn.rollback();
      return res.status(400).json({ error: 'Insufficient tokens' });
    }

    // Deduct tokens
    const newTokens = player.tokens - TOKENS_REQUIRED;
    await conn.query('UPDATE players SET tokens = ? WHERE id = ?', [newTokens, playerId]);

    // Grant XP (and update player's xp)
    const newXP = player.xp + XP_AWARDED;
    await conn.query('UPDATE players SET xp = ? WHERE id = ?', [newXP, playerId]);

    // Insert into unlocks log
    const [unlockResult] = await conn.query(
      `INSERT INTO unlocks (player_id, coach_id, tokens_spent, xp_awarded, red_flag, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [playerId, coachId, TOKENS_REQUIRED, XP_AWARDED, coach.red_flag ? 1 : 0]
    );

    // Insert into xp_history log
    await conn.query(
      `INSERT INTO xp_history (player_id, change_amount, reason, created_at)
       VALUES (?, ?, ?, NOW())`,
      [playerId, XP_AWARDED, `Unlock coach ${coachId}`]
    );

    await conn.commit();

    // return useful response including whether a red flag should show
    return res.json({
      ok: true,
      player: { id: playerId, tokens: newTokens, xp: newXP },
      unlock: {
        id: unlockResult.insertId,
        coachId,
        tokens_spent: TOKENS_REQUIRED,
        xp_awarded: XP_AWARDED,
        red_flag: !!coach.red_flag
      }
    });

  } catch (err) {
    await conn.rollback();
    console.error('unlock error', err);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    conn.release();
  }
};
