import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initDB = async () => {
  try {
    console.log('🔄 Connecting to Supabase and executing schema.sql...');
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    await db.query(schemaSql);
    console.log('✅ Schema imported successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error executing schema:', error);
    process.exit(1);
  }
};

initDB();
