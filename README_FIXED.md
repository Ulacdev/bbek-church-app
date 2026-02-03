# Bible Baptist Ekklesia of Kawit

A comprehensive church management system built with modern web technologies for efficient administration of church members, services, and activities.

## Features

### Member Management

- **Bulk Member Import**: Import hundreds of member records via CSV files with automatic validation and duplicate detection

- **Member Profiles**: Complete member information management with contact details and church roles

- **Advanced Search & Filtering**: Search and filter members by age, join date, position, and more

- **Data Export**: Export member data to Excel format for reporting and backup

### Services Management

- **Water Baptism Registration**: Online registration and management of baptism services

- **Child Dedication**: Track and manage child dedication ceremonies

- **Marriage Services**: Comprehensive marriage service record management

- **Burial Services**: Respectful handling of burial service records

### Administrative Features

- **Role-Based Access Control**: Different permission levels for staff and administrators

- **Audit Trail**: Complete logging of all system activities

- **Data Archive**: Secure archiving of deleted records

- **Multi-Department Management**: Organize members by church departments

## Quick Start

### Prerequisites

- Node.js 16+ and npm
- MySQL 8.0+ database
- Modern web browser

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd bbek-church-app
   ```

2. **Backend Setup**

   ```bash
   cd be
   npm install
   # Configure database connection in .env
   npm start
   ```

3. **Frontend Setup**

   ```bash
   cd fe
   npm install
   npm run dev
   ```

4. **Database Setup**

   - Import the SQL schema from `be/database/` directory
   - Run migration scripts to set up tables

## CSV Import Feature

The system includes a powerful CSV import feature for bulk member registration. This feature allows church administrators to import large numbers of member records efficiently while maintaining data integrity.

### Documentation

- **[Complete CSV Import Documentation](./CSV_IMPORT_DOCUMENTATION.md)**: Comprehensive guide covering all aspects of the CSV import feature
- **[Quick Reference Guide](./CSV_IMPORT_QUICK_REFERENCE.md)**: Quick cheat sheet for common tasks and troubleshooting

### Key Capabilities

- **Bulk Import**: Import hundreds of records in minutes
- **Data Validation**: Automatic validation ensures data quality
- **Duplicate Prevention**: Built-in duplicate detection
- **Error Reporting**: Detailed error reporting for quick fixes
- **Progress Tracking**: Real-time upload progress

### Sample Files

- **[Valid Sample CSV](./sample_members.csv)**: Example of properly formatted CSV file
- **[Invalid Sample CSV](./sample_members_invalid.csv)**: Example showing common errors to avoid

### CSV Format Requirements

The CSV file must include these exact column headers:

```csv
firstname,lastname,middle_name,birthdate,age,gender,address,email,phone_number,position,civil_status,guardian_name,guardian_contact,guardian_relationship
```

**Required Fields**: firstname, lastname, birthdate, age, gender, address, email, phone_number

## System Architecture

### Frontend (Vue.js)

- **Framework**: Vue 3 with Composition API
- **UI Library**: Element Plus (Vue 3)
- **State Management**: Pinia stores
- **Build Tool**: Vite

### Backend (Node.js)

- **Framework**: Express.js
- **Database**: MySQL with connection pooling
- **File Upload**: Multer for CSV uploads
- **Authentication**: JWT-based authentication
- **Validation**: Comprehensive input validation

### Database Design

- **Members Table**: Central member information storage
- **Service Tables**: Separate tables for each service type
- **Archive System**: Automatic record archiving before deletion
- **Audit Trail**: Complete activity logging

## API Documentation

### Member Management Endpoints

- `GET /api/church-records/members/getAllMembers` - List all members with pagination and filtering
- `POST /api/church-records/members/createMember` - Create new member
- `PUT /api/church-records/members/updateMember/:id` - Update member information
- `DELETE /api/church-records/members/deleteMember/:id` - Delete/archive member
- `POST /api/church-records/members/importCSV` - Import members from CSV file
- `GET /api/church-records/members/exportExcel` - Export members to Excel

### Service Endpoints

- `POST /api/services/water-baptisms/create` - Create water baptism registration
- `POST /api/services/child-dedication/create` - Create child dedication record
- `POST /api/services/marriage/create` - Create marriage service record
- `POST /api/services/burial/create` - Create burial service record

## Deployment

### Development

```bash
# Backend
cd be && npm run dev

# Frontend
cd fe && npm run dev
```

### Production

1. **Environment Configuration**: Set production environment variables
2. **Database**: Configure production MySQL database
3. **Build Frontend**: `cd fe && npm run build`
4. **Deploy Backend**: Deploy to Node.js hosting platform
5. **Serve Frontend**: Serve built frontend files via web server

### Windows Service Deployment

See [Windows Service Deployment Guide](./WINDOWS_SERVICE_DEPLOYMENT.md) for detailed instructions on deploying the application as a Windows service.

## Configuration

### Environment Variables

Create `.env` file in the `be` directory:

```env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=church_db
PORT=3000
JWT_SECRET=your_jwt_secret
```

### Database Configuration

The system requires MySQL 8.0+ with the following databases:

- Main application database
- Connection pooling for performance
- Proper indexing for fast queries

## Troubleshooting

### Common Issues

**CSV Import Errors**

- Ensure CSV headers match exactly
- Check file size (max 10MB)
- Verify UTF-8 encoding
- See [CSV Import Documentation](./CSV_IMPORT_DOCUMENTATION.md#error-handling-and-troubleshooting)

**Database Connection Issues**

- Verify MySQL service is running
- Check connection credentials
- Ensure database exists

**Authentication Problems**

- Verify JWT secret is set
- Check token expiration
- Ensure proper authorization headers

### Getting Help

1. Check the detailed documentation for your specific issue
2. Review the troubleshooting sections in individual feature docs
3. Check system logs for detailed error messages
4. Contact system administrator for technical support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For technical support or questions:

- Review the comprehensive documentation
- Check the troubleshooting guides
- Contact the development team

---

_Last Updated: January 2026_
_Version: 1.0_

