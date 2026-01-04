# CSV Upload Button Troubleshooting

## Issue: Upload Button Not Working

### Quick Fix Checklist

1. **Check Browser Console** (F12)

   - Open DevTools and go to Console tab
   - Try to upload and look for error messages
   - Share any errors with us

2. **Verify Upload URL**

   - Make sure parent component passes correct `uploadUrl` prop
   - Should be: `/api/church-records/members/importCSV`
   - Check console output when you click Upload button

3. **Verify Upload Headers**

   - Should include authentication token
   - Example: `{ Authorization: 'Bearer <token>' }`
   - Check if the header is being passed correctly

4. **Check Network Tab**
   - Open DevTools → Network tab
   - Click Upload button
   - Look for the request to `/importCSV`
   - Check if request is being sent
   - Check response status (should be 200 or 207)

### Common Issues

#### Issue 1: uploadUrl is not set

**Symptom**: Message says "Upload URL not configured"
**Fix**: Parent component must pass the `uploadUrl` prop

```vue
<CsvImportDialog
  v-model="showImport"
  uploadUrl="/api/church-records/members/importCSV"
  :uploadHeaders="{ Authorization: `Bearer ${token}` }"
/>
```

#### Issue 2: File not selected

**Symptom**: Upload button is disabled, file picker won't open
**Fix**: Click "Select CSV File" button first to pick a file
**Note**: Button won't enable until file is selected

#### Issue 3: Authentication error (401/403)

**Symptom**: Upload fails with authentication error
**Fix**: Ensure auth token is included in headers

```javascript
uploadHeaders: {
  'Authorization': `Bearer ${getAuthToken()}`
}
```

#### Issue 4: CORS error

**Symptom**: "CORS error" or "blocked by CORS policy"
**Fix**: Backend API endpoint must allow the request origin

- Contact backend team to verify CORS is configured

#### Issue 5: File validation fails

**Symptom**: Message says "Please select a CSV file" or "File size too large"
**Fix**:

- Select a valid CSV file (not Excel, not text)
- File must be less than 10MB
- Check file extension is `.csv`

### How to Debug

1. **Open Browser DevTools** (Press F12)

2. **Go to Console tab** and run:

```javascript
// Check if component is mounted
console.log(window.__VUE__);

// Trigger upload and watch console for debug messages
```

3. **Look for console output** like:

```
Starting upload {
  uploadUrl: "/api/church-records/members/importCSV"
  uploadHeaders: {...}
  selectedFile: "members.csv"
  uploadRef: true
}
```

4. **Check Network requests**:

   - Network tab → Filter by "importCSV"
   - Should see POST request to `/api/church-records/members/importCSV`
   - Check Status: 200/207 = success, 4xx/5xx = error

5. **Check Response**:
   - Click the request → Response tab
   - Should show JSON with: `{ success, message, summary, data }`

### If Nothing Works

Share these details:

1. Browser console error messages (screenshot or paste)
2. Network request details (status code, response body)
3. Parent component code that uses `<CsvImportDialog>`
4. Backend console logs when uploading

---

**Updated**: January 4, 2026
