import pg from 'pg';

const { Pool } = pg;
const connectionString = 'postgresql://postgres.poeenfuhcjqgigretqol:8lk7TaKGczPUXigf@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres';
const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  const { key } = req.query;

  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (!pool) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    if (req.method === 'GET') {
      const result = await pool.query('SELECT value FROM prototype_state WHERE key = $1', [key]);
      if (result.rows.length > 0) {
        return res.status(200).json(result.rows[0].value);
      } else {
        return res.status(404).json({ error: 'Not found' });
      }
    } 
    
    if (req.method === 'POST') {
      const value = req.body;
      await pool.query(`
        INSERT INTO prototype_state (key, value)
        VALUES ($1, $2)
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
      `, [key, JSON.stringify(value)]);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
