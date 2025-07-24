const fs = require('fs');
const path = require('path');
const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');

async function runSeeders() {
  try {
    console.log('🔄 Running seeders...');
    
    // Get all seeder files
    const seederFiles = fs.readdirSync(__dirname)
      .filter(file => file.endsWith('.js') && file !== 'run-seeders.js')
      .sort();

    // Run each seeder
    for (const file of seederFiles) {
      const seeder = require(path.join(__dirname, file));
      console.log(`\n🌱 Running seeder: ${file}`);
      await seeder.up({}, { QueryTypes });
    }

    console.log('\n✅ All seeders completed successfully');
  } catch (error) {
    console.error('❌ Error running seeders:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

// Run the seeders
runSeeders();
