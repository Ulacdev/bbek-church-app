const fs = require('fs');
const csv = require('csv-parser');
const { Transform } = require('stream');

/**
 * CSV Parser Utility - Handles CSV parsing, validation, and processing
 * Provides streaming support for large files and batch processing capabilities
 */

/**
 * Parse CSV file with streaming support
 * @param {String} filePath - Path to CSV file
 * @param {Object} options - Options object
 * @param {Array} options.requiredFields - Required field names
 * @param {Function} options.validationFn - Custom validation function
 * @param {Function} options.transformFn - Optional transform function for each row
 * @param {Number} options.batchSize - Batch size for processing (default: 100)
 * @returns {Promise<Object>} Result object with rows and statistics
 */
async function parseCSVFile(filePath, options = {}) {
  return new Promise((resolve, reject) => {
    const {
      requiredFields = [],
      validationFn = null,
      transformFn = null,
      batchSize = 100
    } = options;

    const rows = [];
    const errors = [];
    const stats = {
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      headersParsed: false,
      parsedHeaders: []
    };

    let rowNumber = 1; // Start from 1 (header is row 0)
    let csvHeaders = null;

    // Create read stream
    const stream = fs.createReadStream(filePath, { encoding: 'utf8' })
      .pipe(csv())
      .on('headers', (headers) => {
        csvHeaders = headers;
        stats.headersParsed = true;
        stats.parsedHeaders = headers;
      })
      .on('data', (data) => {
        rowNumber++;
        stats.totalRows++;

        // Check for required fields
        const requiredFieldErrors = [];
        for (const field of requiredFields) {
          if (!data[field] || data[field].trim() === '') {
            requiredFieldErrors.push(`Missing required field: ${field}`);
          }
        }

        // Run custom validation if provided
        let validationErrors = requiredFieldErrors;
        if (validationFn && typeof validationFn === 'function') {
          const customErrors = validationFn(data, rowNumber);
          validationErrors = [...validationErrors, ...customErrors];
        }

        // Transform data if function provided
        let transformedData = data;
        if (transformFn && typeof transformFn === 'function') {
          try {
            transformedData = transformFn(data, rowNumber);
          } catch (error) {
            validationErrors.push(`Transform error: ${error.message}`);
          }
        }

        // Add to rows or errors
        if (validationErrors.length === 0) {
          rows.push({
            rowNumber,
            data: transformedData,
            valid: true
          });
          stats.validRows++;
        } else {
          rows.push({
            rowNumber,
            data: transformedData,
            valid: false,
            errors: validationErrors
          });
          stats.invalidRows++;
          errors.push({
            rowNumber,
            errors: validationErrors,
            data: transformedData
          });
        }
      })
      .on('error', (error) => {
        reject({
          success: false,
          message: `CSV parsing error: ${error.message}`,
          error
        });
      })
      .on('end', () => {
        resolve({
          success: true,
          rows,
          errors,
          stats,
          headers: csvHeaders
        });
      });

    // Handle stream errors
    stream.on('error', (error) => {
      reject({
        success: false,
        message: `File stream error: ${error.message}`,
        error
      });
    });
  });
}

/**
 * Process rows in batches
 * @param {Array} rows - Array of rows to process
 * @param {Function} processFn - Function to process each batch
 * @param {Number} batchSize - Batch size (default: 100)
 * @returns {Promise<Object>} Result with processed batches and summary
 */
async function processBatches(rows, processFn, batchSize = 100) {
  if (!Array.isArray(rows)) {
    throw new Error('Rows must be an array');
  }

  if (typeof processFn !== 'function') {
    throw new Error('processFn must be a function');
  }

  const results = {
    processed: [],
    failed: [],
    summary: {
      total: rows.length,
      successCount: 0,
      failureCount: 0,
      batchCount: Math.ceil(rows.length / batchSize)
    }
  };

  // Process rows in batches
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);

    try {
      const batchResults = await processFn(batch);

      // Handle batch results
      if (Array.isArray(batchResults)) {
        batchResults.forEach((result) => {
          if (result.success) {
            results.processed.push(result);
            results.summary.successCount++;
          } else {
            results.failed.push(result);
            results.summary.failureCount++;
          }
        });
      }
    } catch (error) {
      // If entire batch fails, mark all rows as failed
      batch.forEach((row) => {
        results.failed.push({
          rowNumber: row.rowNumber,
          data: row.data,
          error: error.message,
          success: false
        });
        results.summary.failureCount++;
      });
    }
  }

  return results;
}

/**
 * Validate CSV headers against required headers
 * @param {Array} csvHeaders - Headers from CSV file
 * @param {Array} requiredHeaders - Required header names
 * @returns {Object} Validation result
 */
function validateHeaders(csvHeaders, requiredHeaders) {
  const result = {
    valid: true,
    missingHeaders: [],
    extraHeaders: []
  };

  // Check for required headers
  const csvHeadersLower = csvHeaders.map(h => h.toLowerCase());
  const requiredHeadersLower = requiredHeaders.map(h => h.toLowerCase());

  requiredHeadersLower.forEach((header) => {
    if (!csvHeadersLower.includes(header)) {
      result.valid = false;
      result.missingHeaders.push(header);
    }
  });

  // Optionally report extra headers
  csvHeadersLower.forEach((header) => {
    if (!requiredHeadersLower.includes(header)) {
      result.extraHeaders.push(header);
    }
  });

  return result;
}

/**
 * Sanitize and normalize CSV row data
 * @param {Object} row - Row data
 * @returns {Object} Sanitized row
 */
function sanitizeRow(row) {
  const sanitized = {};

  for (const [key, value] of Object.entries(row)) {
    // Trim string values
    if (typeof value === 'string') {
      sanitized[key] = value.trim();
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

module.exports = {
  parseCSVFile,
  processBatches,
  validateHeaders,
  sanitizeRow
};
