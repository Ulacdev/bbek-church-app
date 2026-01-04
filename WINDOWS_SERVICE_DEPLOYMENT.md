# Windows Service Deployment Guide

This guide explains how to build and deploy both `church-be` (backend) and `church-fe` (frontend) as Windows Services using `winser`.

## Prerequisites

1. **Node.js** installed (v16 or higher)
2. **Administrator privileges** (required to install Windows Services)
3. **winser** package (will be installed automatically via npm)

## Service Names

- **Backend Service**: `church-be-dev`
- **Frontend Service**: `church-fe-dev`

## Quick Start

### Backend (church-be)

1. Navigate to the backend directory:
   ```powershell
   cd church-be
   ```

2. Build and install/update the service:
   ```powershell
   npm run build:dev
   ```

   This will:
   - Install/update npm dependencies
   - Check if the service exists
   - If exists: Update the service to the new version
   - If not exists: Create a new Windows Service

### Frontend (church-fe)

1. Navigate to the frontend directory:
   ```powershell
   cd church-fe
   ```

2. Build and install/update the service:
   ```powershell
   npm run build:dev
   ```

   This will:
   - Install/update npm dependencies
   - Build the frontend application (`npm run build`)
   - Check if the service exists
   - If exists: Update the service to the new version
   - If not exists: Create a new Windows Service

## Available Scripts

### Backend Scripts

- `npm run build:dev` - Install dependencies and install/update Windows Service
- `npm run install-service:dev` - Install/update Windows Service only (requires dependencies already installed)
- `npm run uninstall-service:dev` - Remove the Windows Service

### Frontend Scripts

- `npm run build:dev` - Install dependencies, build frontend, and install/update Windows Service
- `npm run install-service:dev` - Install/update Windows Service only (requires build to be done first)
- `npm run uninstall-service:dev` - Remove the Windows Service
- `npm run start:server` - Start the frontend server manually (for testing)

## Managing Windows Services

### Using Command Line (sc)

**Start Service:**
```powershell
sc start church-be-dev
sc start church-fe-dev
```

**Stop Service:**
```powershell
sc stop church-be-dev
sc stop church-fe-dev
```

**Check Service Status:**
```powershell
sc query church-be-dev
sc query church-fe-dev
```

**View Service Details:**
```powershell
sc qc church-be-dev
sc qc church-fe-dev
```

### Using Services GUI

1. Press `Win + R` to open Run dialog
2. Type `services.msc` and press Enter
3. Find `church-be-dev` or `church-fe-dev` in the list
4. Right-click to Start, Stop, Restart, or view Properties

## How It Works

### Backend Service

- **Entry Point**: `index.js`
- **Service Name**: `church-be-dev`
- **Auto-start**: Yes (configured with `-s` flag)
- **Environment**: `NODE_ENV=development`

The service runs the Express.js backend server and will automatically start when Windows boots.

### Frontend Service

- **Entry Point**: `server.cjs` (serves static files from `dist/` folder)
- **Service Name**: `church-fe-dev`
- **Port**: 5174 (default, can be changed via `PORT` environment variable)
- **Auto-start**: Yes (configured with `-s` flag)
- **Environment**: `NODE_ENV=development`, `PORT=5174`

The service runs a simple Express.js server that serves the built frontend files. The frontend must be built first (`npm run build`) before installing the service.

## Updating Services

When you run `npm run build:dev`, the script will:

1. Check if the service already exists
2. If it exists:
   - Stop the service
   - Remove the old service
   - Install the updated version
   - The service will start automatically (if it was running before)
3. If it doesn't exist:
   - Create a new service
   - Configure it to start automatically

## Troubleshooting

### Service Won't Start

1. **Check if port is in use:**
   ```powershell
   netstat -ano | findstr :5000
   netstat -ano | findstr :5174
   ```

2. **Check service logs:**
   - Services log to the Windows Event Viewer
   - Open Event Viewer → Windows Logs → Application
   - Look for errors related to `church-be-dev` or `church-fe-dev`

3. **Check environment variables:**
   - Ensure `.env` file exists in `church-be` directory
   - Verify database connection settings

### "Access Denied" Error

- **Solution**: Run PowerShell/Command Prompt as Administrator
- Right-click PowerShell → "Run as Administrator"

### Frontend Service: "dist folder not found"

- **Solution**: Run `npm run build` first to build the frontend
- Then run `npm run install-service:dev`

### Service Installed But Not Starting

1. Check service status:
   ```powershell
   sc query church-be-dev
   ```

2. Check if there are errors in the service configuration:
   ```powershell
   sc qc church-be-dev
   ```

3. Try starting manually to see error messages:
   ```powershell
   sc start church-be-dev
   ```

### Uninstalling Services

To completely remove a service:

```powershell
# Stop the service first
sc stop church-be-dev
sc stop church-fe-dev

# Then uninstall
cd church-be
npm run uninstall-service:dev

cd ../church-fe
npm run uninstall-service:dev
```

Or use the Windows Services GUI:
1. Open `services.msc`
2. Stop the service
3. Right-click → Delete (if available) or use `sc delete`

## Environment Variables

### Backend (.env file in church-be/)

```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bbekdb
JWT_SECRET=your_jwt_secret
FRONTEND_URL1=http://localhost:5174
```

### Frontend

The frontend service uses:
- `PORT=5174` (default, can be overridden)
- `NODE_ENV=development`

For API connection, ensure `VITE_API_URL` is set in your build environment or the frontend is configured to connect to the backend URL.

## Notes

- Services are configured to start automatically on Windows boot
- Services run in the background and don't require a user to be logged in
- Logs are written to Windows Event Viewer
- Both services are named with `-dev` suffix for development environment
- For production, you may want to create separate services (e.g., `church-be-prod`, `church-fe-prod`)

## Next Steps

After deploying both services:

1. Verify backend is running:
   ```powershell
   curl http://localhost:5000/api/health
   ```

2. Verify frontend is running:
   - Open browser: `http://localhost:5174`

3. Check service status:
   ```powershell
   sc query church-be-dev
   sc query church-fe-dev
   ```

Both services should show `STATE: RUNNING` if everything is working correctly.

