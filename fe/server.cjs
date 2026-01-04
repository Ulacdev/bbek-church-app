/**
 * Simple HTTP server to serve the built frontend files
 * Used for Windows Service deployment
 */
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5174;

// Serve static files from the dist directory
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Handle client-side routing - return index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Frontend server running on http://0.0.0.0:${PORT}`);
  console.log(`Serving files from: ${distPath}`);
});

