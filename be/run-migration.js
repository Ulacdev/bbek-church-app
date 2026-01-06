require('dotenv').config();
const { query } = require('./database/db');

async function runMigration() {
  try {
    console.log('Running non-member water baptism migration...');

    // Step 1: Modify member_id column to allow NULL
    console.log('Step 1: Modifying member_id column...');
    await query("ALTER TABLE `tbl_waterbaptism` MODIFY COLUMN `member_id` VARCHAR(45) NULL");
    console.log('✓ member_id column modified to allow NULL');

    // Step 2: Add firstname column
    console.log('Step 2: Adding firstname column...');
    try {
      await query("ALTER TABLE `tbl_waterbaptism` ADD COLUMN `firstname` VARCHAR(100) NULL AFTER `status`");
      console.log('✓ firstname column added');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ firstname column already exists');
      } else {
        throw err;
      }
    }

    // Step 3: Add lastname column
    console.log('Step 3: Adding lastname column...');
    try {
      await query("ALTER TABLE `tbl_waterbaptism` ADD COLUMN `lastname` VARCHAR(100) NULL AFTER `firstname`");
      console.log('✓ lastname column added');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ lastname column already exists');
      } else {
        throw err;
      }
    }

    // Step 4: Add middle_name column
    console.log('Step 4: Adding middle_name column...');
    try {
      await query("ALTER TABLE `tbl_waterbaptism` ADD COLUMN `middle_name` VARCHAR(100) NULL AFTER `lastname`");
      console.log('✓ middle_name column added');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ middle_name column already exists');
      } else {
        throw err;
      }
    }

    // Step 5: Add email column
    console.log('Step 5: Adding email column...');
    try {
      await query("ALTER TABLE `tbl_waterbaptism` ADD COLUMN `email` VARCHAR(100) NULL AFTER `middle_name`");
      console.log('✓ email column added');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ email column already exists');
      } else {
        throw err;
      }
    }

    // Step 6: Add phone_number column
    console.log('Step 6: Adding phone_number column...');
    try {
      await query("ALTER TABLE `tbl_waterbaptism` ADD COLUMN `phone_number` VARCHAR(20) NULL AFTER `email`");
      console.log('✓ phone_number column added');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ phone_number column already exists');
      } else {
        throw err;
      }
    }

    // Step 7: Add birthdate column
    console.log('Step 7: Adding birthdate column...');
    try {
      await query("ALTER TABLE `tbl_waterbaptism` ADD COLUMN `birthdate` DATE NULL AFTER `phone_number`");
      console.log('✓ birthdate column added');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ birthdate column already exists');
      } else {
        throw err;
      }
    }

    // Step 8: Add age column
    console.log('Step 8: Adding age column...');
    try {
      await query("ALTER TABLE `tbl_waterbaptism` ADD COLUMN `age` INT NULL AFTER `birthdate`");
      console.log('✓ age column added');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ age column already exists');
      } else {
        throw err;
      }
    }

    // Step 9: Add gender column
    console.log('Step 9: Adding gender column...');
    try {
      await query("ALTER TABLE `tbl_waterbaptism` ADD COLUMN `gender` VARCHAR(20) NULL AFTER `age`");
      console.log('✓ gender column added');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ gender column already exists');
      } else {
        throw err;
      }
    }

    // Step 10: Add address column
    console.log('Step 10: Adding address column...');
    try {
      await query("ALTER TABLE `tbl_waterbaptism` ADD COLUMN `address` TEXT NULL AFTER `gender`");
      console.log('✓ address column added');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ address column already exists');
      } else {
        throw err;
      }
    }

    // Step 11: Add civil_status column
    console.log('Step 11: Adding civil_status column...');
    try {
      await query("ALTER TABLE `tbl_waterbaptism` ADD COLUMN `civil_status` VARCHAR(20) NULL AFTER `address`");
      console.log('✓ civil_status column added');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ civil_status column already exists');
      } else {
        throw err;
      }
    }

    // Step 12: Add is_member column
    console.log('Step 12: Adding is_member column...');
    try {
      await query("ALTER TABLE `tbl_waterbaptism` ADD COLUMN `is_member` TINYINT(1) DEFAULT 1 AFTER `civil_status`");
      console.log('✓ is_member column added');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ is_member column already exists');
      } else {
        throw err;
      }
    }

    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('Error running migration:', error);
  } finally {
    process.exit();
  }
}

runMigration();
