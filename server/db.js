import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const connectionString = process.env.DATABASE_URL || '';
const pool = connectionString ? new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
}) : null;

/**
 * Executes a query against the PostgreSQL database.
 * @param {string} text - The SQL query text.
 * @param {Array} params - Array of parameters for the query.
 * @returns {Promise<any>} The result of the query.
 */
export const query = async (text, params) => {
  if (!pool) {
    console.warn('Database not connected. Skipping query:', text);
    return { rows: [], rowCount: 0 };
  }
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
