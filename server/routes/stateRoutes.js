import express from 'express';
import db from '../db.js';

const router = express.Router();

// Initialize the table if it doesn't exist
const initTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS prototype_state (
          key VARCHAR(50) PRIMARY KEY,
          value JSONB
      );
    `);
  } catch (err) {
    console.error("Error creating prototype_state table", err);
  }
};
initTable();

router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const result = await db.query('SELECT value FROM prototype_state WHERE key = $1', [key]);
    if (result.rows.length > 0) {
      res.json(result.rows[0].value);
    } else {
      res.status(404).json({ error: 'Key not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const value = req.body;
    await db.query(`
      INSERT INTO prototype_state (key, value)
      VALUES ($1, $2)
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
    `, [key, JSON.stringify(value)]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
