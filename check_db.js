import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({
  connectionString: 'postgresql://postgres.poeenfuhcjqgigretqol:8lk7TaKGczPUXigf@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function check() {
  try {
    const res = await pool.query('SELECT * FROM prototype_state');
    console.log('prototype_state rows:', res.rowCount);
    res.rows.forEach(r => console.log(r.key, 'EXISTS'));
  } catch(e) {
    console.error('Error:', e.message);
  }
  pool.end();
}
check();
