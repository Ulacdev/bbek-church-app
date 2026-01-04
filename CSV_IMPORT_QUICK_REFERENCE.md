# CSV Import Quick Reference Guide

## Essential Information at a Glance

### Required CSV Headers (Exact Match Required)

```
firstname,lastname,middle_name,birthdate,age,gender,address,email,phone_number,position,civil_status,guardian_name,guardian_contact,guardian_relationship
```

### Required Fields Checklist

- [ ] firstname
- [ ] lastname
- [ ] birthdate
- [ ] age
- [ ] gender
- [ ] address
- [ ] email
- [ ] phone_number

### Format Requirements

| Field     | Format                                | Example              |
| --------- | ------------------------------------- | -------------------- |
| birthdate | YYYY-MM-DD, MM/DD/YYYY, or DD/MM/YYYY | 1990-01-15           |
| gender    | M, F, or O                            | M                    |
| age       | Number (0-150)                        | 34                   |
| email     | username@domain.com                   | john.doe@example.com |

### File Specifications

- **Max Size**: 10MB
- **Format**: CSV only
- **Encoding**: UTF-8
- **Headers**: Required in first row

### Import Steps

1. Click "Import CSV" button in Members section
2. Select your CSV file
3. Click "Upload"
4. Wait for processing
5. Review results summary
6. Fix any errors and reimport if needed

### Quick Error Fixes

| Error                       | Fix                             |
| --------------------------- | ------------------------------- |
| "Missing required field"    | Fill empty required fields      |
| "Invalid email format"      | Use format: username@domain.com |
| "Invalid birthdate format"  | Use YYYY-MM-DD format           |
| "Invalid gender"            | Use only M, F, or O             |
| "Invalid age"               | Use whole numbers 0-150         |
| "Duplicate member detected" | Check if member already exists  |

### Best Practices

- ✅ Start with sample file to test
- ✅ Clean data before importing
- ✅ Use consistent date formats
- ✅ Ensure UTF-8 encoding
- ✅ Backup data before bulk imports
- ❌ Don't close browser during import
- ❌ Don't import without validating data first
- ❌ Don't use special characters in headers

### Duplicate Detection

The system prevents duplicates by checking:

1. Email address (case-insensitive)
2. Phone number (with +63 normalization)
3. Name + birthdate combination

---

_For detailed documentation, see [CSV_IMPORT_DOCUMENTATION.md](./CSV_IMPORT_DOCUMENTATION.md)_
