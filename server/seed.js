import bcrypt from 'bcryptjs';
import db from './db.js';

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Create Super Admin user
    const email = 'admin@ninveh.gov.iq';
    const rawPassword = 'admin123'; 
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(rawPassword, saltRounds);

    const checkAdmin = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (checkAdmin.rows.length === 0) {
      await db.query(
        `INSERT INTO users (full_name, email, password_hash, role, district_ids)
         VALUES ($1, $2, $3, $4, $5)`,
        ['Super Admin', email, passwordHash, 'Admin', '{}']
      );
      console.log('✅ Super Admin account created successfully!');
    } else {
      console.log('⚠️ Super Admin account already exists. Skipping...');
    }

    console.log('🎉 Seeding finished.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

seedDatabase();
