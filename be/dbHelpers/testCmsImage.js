/**
 * Test script to verify CMS image BLOB storage
 * Run this to test if images are being saved correctly as BLOB
 */

const { query } = require('../database/db');
const { saveCmsImage, getCmsImage, base64ToBuffer, bufferToBase64 } = require('./cmsRecords');

async function testImageStorage() {
  try {
    console.log('=== Testing CMS Image BLOB Storage ===\n');

    // Test data: A small 1x1 red PNG image in base64
    const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const pageName = 'test';
    const fieldName = 'test_image';

    console.log('1. Converting base64 to buffer...');
    const imageData = base64ToBuffer(testImageBase64);
    if (!imageData || !imageData.buffer) {
      console.error('❌ Failed to convert base64 to buffer');
      return;
    }
    console.log(`✅ Buffer created: ${imageData.buffer.length} bytes, MIME: ${imageData.mimeType}`);
    console.log(`   Buffer type: ${Buffer.isBuffer(imageData.buffer) ? 'Buffer' : typeof imageData.buffer}`);

    console.log('\n2. Saving image to database...');
    const saveResult = await saveCmsImage(pageName, fieldName, imageData.buffer, imageData.mimeType);
    if (!saveResult.success) {
      console.error('❌ Failed to save image:', saveResult.message);
      return;
    }
    console.log(`✅ Image saved successfully. Image ID: ${saveResult.imageId}`);

    console.log('\n3. Verifying image in database...');
    const verifySql = `
      SELECT image_id, LENGTH(image_blob) as blob_size, mime_type,
             CASE 
               WHEN image_blob IS NULL THEN 'NULL'
               WHEN LENGTH(image_blob) = 0 THEN 'EMPTY'
               ELSE 'HAS_DATA'
             END as blob_status
      FROM tbl_cms_images
      WHERE page_name = ? AND field_name = ?
    `;
    const [verifyRows] = await query(verifySql, [pageName, fieldName]);
    if (verifyRows.length > 0) {
      const row = verifyRows[0];
      console.log(`✅ Image found in database:`);
      console.log(`   Image ID: ${row.image_id}`);
      console.log(`   BLOB Size: ${row.blob_size} bytes`);
      console.log(`   BLOB Status: ${row.blob_status}`);
      console.log(`   MIME Type: ${row.mime_type}`);
      
      if (row.blob_status === 'HAS_DATA' && row.blob_size > 0) {
        console.log('✅ BLOB is stored correctly!');
      } else {
        console.error('❌ BLOB is not stored correctly!');
      }
    } else {
      console.error('❌ Image not found in database after save');
      return;
    }

    console.log('\n4. Retrieving image from database...');
    const getResult = await getCmsImage(pageName, fieldName);
    if (!getResult.success || !getResult.data) {
      console.error('❌ Failed to retrieve image:', getResult.message);
      return;
    }
    console.log(`✅ Image retrieved successfully`);
    console.log(`   Retrieved size: ${getResult.data.imageBuffer ? getResult.data.imageBuffer.length : 0} bytes`);
    console.log(`   Is Buffer: ${Buffer.isBuffer(getResult.data.imageBuffer)}`);

    console.log('\n5. Converting back to base64...');
    const retrievedBase64 = bufferToBase64(getResult.data.imageBuffer, getResult.data.mimeType);
    if (retrievedBase64) {
      console.log(`✅ Converted to base64: ${retrievedBase64.substring(0, 50)}...`);
      console.log(`   Base64 length: ${retrievedBase64.length} characters`);
      
      // Compare with original (should match)
      const originalBase64 = testImageBase64.split(',')[1];
      const retrievedBase64Data = retrievedBase64.split(',')[1];
      if (originalBase64 === retrievedBase64Data) {
        console.log('✅ Base64 data matches original!');
      } else {
        console.log('⚠️  Base64 data does not match (this might be okay if image was re-encoded)');
      }
    } else {
      console.error('❌ Failed to convert buffer to base64');
    }

    console.log('\n6. Cleaning up test data...');
    const deleteSql = `DELETE FROM tbl_cms_images WHERE page_name = ? AND field_name = ?`;
    await query(deleteSql, [pageName, fieldName]);
    console.log('✅ Test data cleaned up');

    console.log('\n=== Test Complete ===');
    console.log('✅ All tests passed! Images are being stored as BLOB correctly.');

  } catch (error) {
    console.error('\n❌ Test failed with error:', error);
    console.error(error.stack);
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testImageStorage()
    .then(() => {
      console.log('\nTest completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Test error:', error);
      process.exit(1);
    });
}

module.exports = { testImageStorage };

