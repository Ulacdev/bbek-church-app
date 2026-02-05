/**
 * File Chunk Upload Utility
 * Handles splitting large CSV/Excel files into chunks for Vercel serverless deployment
 * Vercel has a 4.5MB payload limit, so files over 1MB should be chunked
 */

import * as XLSX from 'xlsx';
import axios from '@/api/axios';

/**
 * Simple CSV parser (doesn't require external dependency)
 * Handles basic CSV parsing with quoted fields
 */
const parseCSVText = (csvText) => {
  const lines = csvText.split('\n');
  if (lines.length < 2) {
    return [];
  }

  // Parse header
  const headers = parseCSVLine(lines[0]);
  
  // Parse data rows
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = parseCSVLine(line);
    const row = {};
    headers.forEach((header, index) => {
      row[header.trim()] = values[index] ? values[index].trim() : '';
    });
    data.push(row);
  }

  return data;
};

/**
 * Parse a single CSV line handling quoted fields
 */
const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // Field separator
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
};

/**
 * Parse Excel file buffer into array of objects
 */
const parseExcelBuffer = (buffer) => {
  try {
    const workbook = XLSX.read(buffer, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);
    return data;
  } catch (error) {
    throw new Error(`Excel parsing error: ${error.message}`);
  }
};

/**
 * Parse CSV file buffer into array of objects
 */
const parseCSVBuffer = async (buffer) => {
  const csvText = new TextDecoder().decode(buffer);
  return parseCSVText(csvText);
};

/**
 * Parse file (CSV or Excel) into array of objects
 */
export const parseFile = async (file) => {
  const fileExtension = file.name.toLowerCase().endsWith('.xlsx') ? '.xlsx' : '.csv';
  const buffer = await file.arrayBuffer();
  
  if (fileExtension === '.xlsx') {
    return parseExcelBuffer(new Uint8Array(buffer));
  } else {
    return parseCSVBuffer(new Uint8Array(buffer));
  }
};

/**
 * Split data array into chunks
 * Each chunk is limited to a maximum JSON size to ensure it stays under Vercel's limit
 */
export const chunkData = (dataArray, maxJsonSize = 900 * 1024) => { // 900KB per chunk (safe margin below 1MB)
  const chunks = [];
  let currentChunk = [];
  let currentSize = 0;

  for (const row of dataArray) {
    const rowSize = JSON.stringify(row).length;
    
    // If adding this row exceeds the limit and we have data, start a new chunk
    if (currentSize + rowSize > maxJsonSize && currentChunk.length > 0) {
      chunks.push(currentChunk);
      currentChunk = [row];
      currentSize = rowSize;
    } else {
      currentChunk.push(row);
      currentSize += rowSize;
    }
  }

  // Add the last chunk
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
};

/**
 * Upload file with chunking for large files
 * Returns results of the import
 */
export const uploadFileWithChunking = async (file, accessToken, onProgress) => {
  try {
    // Get file size
    const fileSizeInMB = file.size / (1024 * 1024);
    
    // If file is small enough, use single upload
    if (fileSizeInMB < 1) {
      console.log(`[Upload] File size ${fileSizeInMB.toFixed(2)}MB - using single upload`);
      return uploadFileSingle(file, accessToken);
    }

    // Large file - use chunked upload
    console.log(`[Upload] File size ${fileSizeInMB.toFixed(2)}MB - using chunked upload`);
    return uploadFileChunked(file, accessToken, onProgress);
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

/**
 * Single file upload for small files
 */
const uploadFileSingle = async (file, accessToken) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post('/church-records/members/import', formData, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    timeout: 300000 // 5 minutes
  });

  if (!response.data.success) {
    throw new Error(response.data.message || 'Import failed');
  }

  return response.data.data;
};

/**
 * Chunked file upload for large files
 * Parses file, splits into chunks, uploads each chunk, combines on backend
 */
const uploadFileChunked = async (file, accessToken, onProgress) => {
  try {
    // Step 1: Parse the file
    console.log('[Upload] Parsing file...');
    const dataRows = await parseFile(file);
    
    if (!dataRows || dataRows.length === 0) {
      throw new Error('No data found in file');
    }

    console.log(`[Upload] File contains ${dataRows.length} rows`);

    // Step 2: Split into chunks
    const chunks = chunkData(dataRows);
    console.log(`[Upload] Split into ${chunks.length} chunks`);

    // Generate unique upload ID
    const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Step 3: Upload each chunk
    let uploadedChunks = 0;
    for (let i = 0; i < chunks.length; i++) {
      const chunkNumber = i + 1;
      const chunk = chunks[i];

      console.log(`[Upload] Uploading chunk ${chunkNumber}/${chunks.length} (${chunk.length} rows)...`);

      const response = await axios.post(
        '/church-records/members/import-chunk',
        {
          uploadId,
          chunkNumber,
          totalChunks: chunks.length,
          dataRows: chunk,
          fileName: file.name,
          fileExtension: file.name.toLowerCase().endsWith('.xlsx') ? '.xlsx' : '.csv'
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          timeout: 300000 // 5 minutes per chunk
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || `Chunk ${chunkNumber} upload failed`);
      }

      uploadedChunks++;

      // Report progress
      if (onProgress) {
        onProgress({
          chunksUploaded: uploadedChunks,
          totalChunks: chunks.length,
          percentComplete: Math.round((uploadedChunks / chunks.length) * 100)
        });
      }

      // If this was the last chunk and upload is complete, return results
      if (response.data.uploadComplete) {
        console.log('[Upload] All chunks received and processed on backend');
        return response.data.data;
      }
    }

    throw new Error('Upload completed but results not received');
  } catch (error) {
    console.error('[Upload] Chunked upload error:', error);
    throw error;
  }
};

export default {
  parseFile,
  chunkData,
  uploadFileWithChunking,
  uploadFileSingle,
  uploadFileChunked
};
