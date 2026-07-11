import bcrypt from 'bcrypt';
import db from './db.js';

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Create Super Admin user
    const username = 'admin';
    const email = 'admin@ninveh-health.gov.iq';
    const rawPassword = 'admin'; // Using simple password for testing
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(rawPassword, saltRounds);

    const checkAdmin = await db.query('SELECT * FROM users WHERE username = $1', [username]);

    if (checkAdmin.rows.length === 0) {
      await db.query(
        `INSERT INTO users (full_name, username, email, password_hash, role, district_ids, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        ['مدير النظام العام', username, email, passwordHash, 'Admin', '{}', true]
      );
      console.log('✅ Super Admin account created successfully! (Username: admin, Password: admin)');
    } else {
      console.log('⚠️ Super Admin account already exists. Skipping...');
    }

    // You can add more seed data here (e.g., sample establishments)

    console.log('🎉 Seeding finished.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

seedDatabase();
