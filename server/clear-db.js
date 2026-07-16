import db from './db.js';

const clearDatabase = async () => {
  try {
    console.log('🧹 Clearing data for testing...');
    
    await db.query('TRUNCATE TABLE closures CASCADE');
    await db.query('TRUNCATE TABLE evaluations CASCADE');
    await db.query('TRUNCATE TABLE establishments CASCADE');
    
    console.log('✅ All test data cleared! Users are kept.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error clearing db:', err);
    process.exit(1);
  }
};

clearDatabase();
