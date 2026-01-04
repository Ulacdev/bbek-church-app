# Connection Refused Troubleshooting Guide

## Problem
Getting "connection refused" errors when frontend tries to connect to backend.

## Configuration Overview

### Frontend (church-fe)
- **Port**: 5174
- **Proxy**: `/api` requests are forwarded to backend
- **Backend URL**: `http://localhost:5000` (default, or from `VITE_API_URL` env var)

### Backend (church-be)
- **Port**: 5000 (default, or from `PORT` env var)
- **CORS**: Allows `http://localhost:5174`

## Common Causes & Solutions

### 1. Backend Server Not Running ⚠️ (Most Common)

**Symptom**: Connection refused error in browser console

**Solution**:
```bash
# Navigate to backend directory
cd church-be

# Start the backend server
npm run dev
# or
npm start
```

**Verify**: Check backend console for:
```
🚀 Server running on port 5000
📦 Environment: development
🌐 CORS enabled for: http://localhost:5174
```

### 2. Backend Running on Different Port

**Check**: Look at backend console output for the actual port

**Solution**: 
- Option A: Set `VITE_API_URL` in `church-fe/.env`:
  ```
  VITE_API_URL=http://localhost:YOUR_PORT
  ```
- Option B: Set `PORT` in `church-be/.env`:
  ```
  PORT=5000
  ```

### 3. Database Connection Failure

**Symptom**: Backend crashes on startup with database errors

**Solution**: 
1. Check database is running
2. Verify database credentials in `church-be/.env`:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=bbekdb
   ```

### 4. Firewall Blocking Connection

**Symptom**: Connection refused even when backend is running

**Solution**: 
- Check Windows Firewall settings
- Ensure port 5000 is not blocked
- Try accessing `http://localhost:5000/api/health` directly in browser

### 5. Port Already in Use

**Symptom**: Backend fails to start with "port already in use" error

**Solution**:
```bash
# Find process using port 5000 (Windows)
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

## Quick Diagnostic Steps

1. **Check if backend is running**:
   ```bash
   # In browser or terminal
   curl http://localhost:5000/api/health
   # Should return: {"status":"ok","message":"Church backend is running",...}
   ```

2. **Check frontend proxy configuration**:
   - Look at Vite console when starting frontend
   - Should show: `Backend API URL: http://localhost:5000`

3. **Check browser console**:
   - Look for detailed error messages
   - Check Network tab to see failed requests

4. **Check backend console**:
   - Look for startup messages
   - Check for any error logs

## Testing the Connection

1. **Start Backend**:
   ```bash
   cd church-be
   npm run dev
   ```

2. **Start Frontend** (in separate terminal):
   ```bash
   cd church-fe
   npm run dev
   ```

3. **Test Health Endpoint**:
   - Open browser: `http://localhost:5000/api/health`
   - Should see JSON response with status "ok"

4. **Test via Frontend**:
   - Open browser: `http://localhost:5174`
   - Check browser console for any errors
   - Check Network tab for API requests

## Environment Variables

### Frontend (.env in church-fe)
```env
VITE_API_URL=http://localhost:5000
```

### Backend (.env in church-be)
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bbekdb
DB_SSL=false
DB_CONNECTION_LIMIT=10
JWT_SECRET=your-super-secret-jwt-key-change-in-production
FRONTEND_URL1=http://localhost:5174
FRONTEND_URL2=http://localhost:5173
```

## Improved Error Messages

The configuration has been updated to show clearer error messages:
- Proxy errors now show the target URL and specific error codes
- Axios errors now indicate when backend is not running
- Console logs show connection attempts and failures

## Still Having Issues?

1. Check both frontend and backend console logs
2. Verify both servers are running
3. Test backend health endpoint directly
4. Check for port conflicts
5. Verify environment variables are set correctly

