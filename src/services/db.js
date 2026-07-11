import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});

/**
 * Executes a query against the PostgreSQL database.
 * @param {string} text - The SQL query text.
 * @param {Array} params - Array of parameters for the query.
 * @returns {Promise<any>} The result of the query.
 */
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database Query Error:', error);
    throw error;
  }
};

export default {
  query,
  pool,
};
