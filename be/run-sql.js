require('dotenv').config();
const { query } = require('./database/db');
const fs = require('fs');
const path = require('path');

async function runSQL() {
  try {
    const sqlFile = path.join(__dirname, 'database', 'simple_water_baptism.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    console.log('Running SQL:', sql);

    const [result] = await query(sql);
    console.log('SQL executed successfully:', result);
  } catch (error) {
    console.error('Error running SQL:', error);
  } finally {
    process.exit();
  }
}

runSQL();