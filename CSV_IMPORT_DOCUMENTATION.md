# CSV Import Feature Documentation

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [CSV Format Requirements](#csv-format-requirements)
4. [How to Use the CSV Import Feature](#how-to-use-the-csv-import-feature)
5. [Validation Rules](#validation-rules)
6. [Error Handling and Troubleshooting](#error-handling-and-troubleshooting)
7. [Best Practices](#best-practices)
8. [Sample Files](#sample-files)
9. [Technical Details](#technical-details)

## Overview

The CSV Import feature allows church administrators to efficiently import large numbers of member records into the church management system. This feature is designed to handle bulk data entry while maintaining data integrity and preventing duplicates.

### Key Benefits

- **Bulk Import**: Import hundreds of member records in a single operation
- **Data Validation**: Automatic validation ensures data quality and consistency
- **Duplicate Prevention**: Built-in duplicate detection prevents overwriting existing members
- **Error Reporting**: Detailed error reporting helps identify and fix issues quickly
- **User-Friendly Interface**: Simple, intuitive interface with progress tracking

## Features

### Import Capabilities

- ✅ Support for standard CSV file format
- ✅ Automatic data type validation
- ✅ Duplicate detection and prevention
- ✅ Required field validation
- ✅ Format validation (email, date, phone number, etc.)
- ✅ Progress tracking with visual feedback
- ✅ Comprehensive error reporting
- ✅ Detailed import summary

### Supported File Types

- **CSV Files**: Standard comma-separated values files (.csv)
- **File Size Limit**: Maximum 10MB per file
- **Character Encoding**: UTF-8 encoding recommended

## CSV Format Requirements

### Required Column Headers

The CSV file must include these exact column headers in the first row:

| Column                  | Description                  | Required | Data Type | Format/Validation                             |
| ----------------------- | ---------------------------- | -------- | --------- | --------------------------------------------- |
| `firstname`             | Member's first name          | Yes      | String    | 1-45 characters                               |
| `lastname`              | Member's last name           | Yes      | String    | 1-45 characters                               |
| `middle_name`           | Member's middle name         | No       | String    | 0-45 characters                               |
| `birthdate`             | Member's birth date          | Yes      | Date      | YYYY-MM-DD, MM/DD/YYYY, or DD/MM/YYYY         |
| `age`                   | Member's age                 | Yes      | Integer   | 0-150 years                                   |
| `gender`                | Member's gender              | Yes      | String    | M (Male), F (Female), O (Other)               |
| `address`               | Member's address             | Yes      | String    | 1-45 characters                               |
| `email`                 | Member's email address       | Yes      | String    | Valid email format                            |
| `phone_number`          | Member's phone number        | Yes      | String    | Valid phone number format                     |
| `position`              | Member's church position     | No       | String    | Default: "member"                             |
| `civil_status`          | Member's civil status        | No       | String    | single, married, widowed, divorced, separated |
| `guardian_name`         | Guardian's name (for minors) | No       | String    | 0-45 characters                               |
| `guardian_contact`      | Guardian's contact info      | No       | String    | Valid phone number or email                   |
| `guardian_relationship` | Relationship to guardian     | No       | String    | 0-45 characters                               |

### Optional Fields

All fields except the required ones are optional. If not provided, they will be set to:

- `middle_name`: null/empty
- `position`: "member"
- `civil_status`: null/empty
- `guardian_name`: null/empty
- `guardian_contact`: null/empty
- `guardian_relationship`: null/empty

## How to Use the CSV Import Feature

### Step-by-Step Guide

#### 1. Prepare Your CSV File

1. Create a new CSV file with a spreadsheet application (Excel, Google Sheets, etc.)
2. Ensure the first row contains the exact column headers listed above
3. Fill in the member data in subsequent rows
4. Save the file as CSV format with UTF-8 encoding

#### 2. Access the Import Feature

1. Log in to the church management system with appropriate permissions
2. Navigate to **Admin > Church Records > Members**
3. Click the **"Import CSV"** button in the top-right corner

#### 3. Upload and Process

1. Click **"Select CSV File"** button
2. Choose your prepared CSV file
3. Review the file information (name, size)
4. Click **"Upload"** to start the import process
5. Wait for the import to complete (progress bar will show status)

#### 4. Review Results

After the import completes, you'll see a summary showing:

- **Total rows processed**
- **Successfully imported members**
- **Duplicate records skipped**
- **Invalid records with errors**

#### 5. Handle Issues (if any)

If there are errors:

1. Review the error details in the table below the summary
2. Fix the issues in your original CSV file
3. Import the corrected file again

## Validation Rules

### Required Field Validation

- **Missing Values**: Any required field that is empty or contains only whitespace will cause the row to be rejected
- **Case Sensitivity**: Field names are case-sensitive and must match exactly

### Data Format Validation

#### Email Address

- Must be a valid email format: `username@domain.com`
- Examples: `john.doe@example.com`, `jane.smith@church.org`
- Invalid: `invalid-email`, `missing@domain`, `@domain.com`

#### Birthdate

- Supported formats:
  - `YYYY-MM-DD` (ISO format): `1990-01-15`
  - `MM/DD/YYYY`: `01/15/1990`
  - `DD/MM/YYYY`: `15/01/1990`
- Must be a valid calendar date
- Future dates are allowed (for newborns)

#### Gender

- Must be exactly one of: `M`, `F`, `O`
- Case-insensitive: `m`, `f`, `o` are also accepted
- Invalid values: `Male`, `Female`, `Other`, `1`, `0`

#### Age

- Must be a whole number (integer)
- Range: 0 to 150 years
- Invalid: negative numbers, decimals, text

#### Phone Number

- No strict format requirements
- Recommended: Include country code for international numbers
- Examples: `+639123456789`, `09123456789`, `(02) 123-4567`

### Duplicate Detection

The system checks for duplicates based on:

1. **Email address** (case-insensitive)
2. **Phone number** (normalizes +63 prefix)
3. **Name + Birthdate combination** (case-insensitive)

If a potential duplicate is found, the record will be skipped to prevent overwriting existing data.

## Error Handling and Troubleshooting

### Common Error Messages

| Error Type                          | Description                      | Solution                                  |
| ----------------------------------- | -------------------------------- | ----------------------------------------- |
| "Missing required field: firstname" | Required field is empty          | Fill in all required fields               |
| "Invalid email format"              | Email doesn't match valid format | Use format: username@domain.com           |
| "Invalid birthdate format"          | Date is not in accepted format   | Use YYYY-MM-DD, MM/DD/YYYY, or DD/MM/YYYY |
| "Invalid gender"                    | Gender must be M, F, or O        | Use only M, F, or O                       |
| "Invalid age"                       | Age must be a number 0-150       | Use whole numbers only                    |
| "Duplicate member detected"         | Record already exists            | Check if member is already in system      |

### File-Related Issues

#### File Size Too Large

- **Problem**: File exceeds 10MB limit
- **Solution**: Split large files into smaller chunks

#### Invalid File Type

- **Problem**: File is not a CSV format
- **Solution**: Save file as .csv format

#### Encoding Issues

- **Problem**: Special characters appear incorrectly
- **Solution**: Save CSV file with UTF-8 encoding

#### Column Header Mismatch

- **Problem**: Column names don't match exactly
- **Solution**: Use exact header names listed in the format requirements

### Import Process Issues

#### Upload Fails

- Check internet connection
- Ensure file is not corrupted
- Try refreshing the page and uploading again

#### Processing Hangs

- Don't close the browser tab during import
- Wait for completion or timeout
- If stuck, refresh and try again with smaller file

#### Partial Import Success

- Review error details carefully
- Fix identified issues in source file
- Import corrected file again

## Best Practices

### Before Importing

#### Data Preparation

1. **Clean your data**: Remove duplicates and invalid entries before importing
2. **Standardize formats**: Use consistent date and phone number formats
3. **Validate emails**: Ensure all email addresses are valid and unique
4. **Backup existing data**: Always have a backup before bulk imports

#### File Organization

1. **Use descriptive filenames**: `church_members_2024_jan.csv`
2. **Include headers**: Ensure first row contains exact column headers
3. **UTF-8 encoding**: Save CSV files with UTF-8 encoding for special characters
4. **Test with small file**: Start with a small test file (5-10 records)

### During Import

#### Process Management

1. **Stable connection**: Ensure stable internet connection
2. **Don't interrupt**: Don't close browser or navigate away during import
3. **Monitor progress**: Watch the progress bar and status messages
4. **Document issues**: Note any errors for future reference

### After Import

#### Verification

1. **Check summary**: Review the import summary carefully
2. **Spot check**: Manually verify a few imported records
3. **Check for missing data**: Ensure all expected records were imported
4. **Test functionality**: Verify imported members can be edited and used in other features

#### Maintenance

1. **Regular backups**: Schedule regular database backups
2. **Data hygiene**: Periodically check for and remove actual duplicates
3. **Update records**: Keep member information current
4. **Monitor system**: Watch for any issues with imported data

## Sample Files

### Valid CSV Example

```csv
firstname,lastname,middle_name,birthdate,age,gender,address,email,phone_number,position,civil_status,guardian_name,guardian_contact,guardian_relationship
John,Doe,,1990-01-15,34,M,123 Main St,john.doe@example.com,+639123456789,member,single,,,
Jane,Smith,Maria,1985-05-20,39,F,456 Oak Ave,jane.smith@example.com,+639987654321,member,married,,,
Bob,Johnson,,2000-12-10,23,M,789 Pine Rd,bob.johnson@example.com,+639555123456,member,single,,,
Alice,Brown,Lee,1975-03-08,49,F,321 Elm St,alice.brown@example.com,+639444567890,pastor,married,,,
```

### Invalid CSV Example

```csv
firstname,lastname,middle_name,birthdate,age,gender,address,email,phone_number,position,civil_status,guardian_name,guardian_contact,guardian_relationship
,Doe,,1990-01-15,34,M,123 Main St,john.doe@example.com,+639123456789,member,single,,,
Jane,Smith,Maria,invalid-date,39,F,456 Oak Ave,jane.smith@example.com,+639987654321,member,married,,,
Bob,Johnson,,2000-12-10,not-a-number,M,789 Pine Rd,bob.johnson@example.com,+639555123456,member,single,,,
Alice,Brown,Lee,1975-03-08,49,X,321 Elm St,invalid-email,639444567890,pastor,married,,,
```

### Common Issues to Fix

1. **Empty firstname**: Row 2 has empty firstname
2. **Invalid date**: "invalid-date" is not a valid date format
3. **Invalid age**: "not-a-number" is not a valid age
4. **Invalid gender**: "X" is not a valid gender value
5. **Invalid email**: "invalid-email" is not a valid email format

## Technical Details

### File Upload Specifications

- **Maximum file size**: 10MB
- **Accepted formats**: .csv files only
- **Upload method**: Multipart form data
- **Processing**: Server-side parsing and validation
- **Storage**: Temporary file storage (cleaned up after processing)

### Backend Processing

1. **File validation**: Checks file type and size
2. **CSV parsing**: Uses csv-parser library for robust parsing
3. **Data validation**: Validates each row against business rules
4. **Duplicate checking**: Queries database for existing records
5. **Database insertion**: Batch inserts valid records
6. **Result compilation**: Generates detailed import report

### Database Schema

The imported data maps to the `tbl_members` table with the following key fields:

- `member_id`: Auto-generated (format: 000000001)
- `firstname`, `lastname`, `middle_name`: Personal information
- `birthdate`, `age`, `gender`: Demographics
- `address`, `email`, `phone_number`: Contact information
- `position`, `civil_status`: Church-specific fields
- `guardian_*`: Guardian information (for minors)
- `date_created`: Automatically set to current timestamp

### API Endpoints

- **Upload**: `POST /api/church-records/members/importCSV`
- **Authentication**: Bearer token required
- **Response format**: JSON with success/error status and detailed summary

### Performance Considerations

- **Processing time**: Depends on file size and server load
- **Memory usage**: Processes files in streaming fashion
- **Database impact**: Batch operations to minimize locking
- **Concurrent imports**: Only one import allowed at a time

### Security Features

- **File type validation**: Only CSV files accepted
- **File size limits**: Prevents abuse with large files
- **Authentication required**: Only authorized users can import
- **Input sanitization**: All data sanitized before database insertion
- **Error logging**: All errors logged for security auditing

---

## Support and Troubleshooting

If you encounter issues with the CSV import feature:

1. **Check this documentation** for common solutions
2. **Verify your CSV format** matches the requirements exactly
3. **Test with the sample files** provided
4. **Contact system administrator** for technical support
5. **Check system status** for any known issues

For technical support, please provide:

- Error messages from the import process
- Sample of your CSV file (with sensitive data removed)
- Browser and operating system information
- Steps to reproduce the issue

---

_Last Updated: January 2026_
_Version: 1.0_
