/**
 * Script to install or update Windows Service for church-fe
 * Checks if service exists and updates it, or creates new one
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const serviceName = 'church-fe-dev';
const serviceDescription = 'Church Frontend Service (Dev)';
const appPath = path.join(__dirname, 'server.cjs');

console.log('='.repeat(60));
console.log('Church Frontend - Windows Service Installation');
console.log('='.repeat(60));

// Check if dist folder exists (build must be done first)
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  console.error('✗ Error: dist folder not found!');
  console.error('Please run "npm run build" first to build the frontend.');
  process.exit(1);
}

try {
  // Check if service exists
  console.log(`Checking if service "${serviceName}" exists...`);
  execSync(`sc query ${serviceName}`, { stdio: 'ignore' });
  
  console.log('✓ Service exists');
  console.log('Updating service...');
  
  // Remove existing service
  try {
    execSync(`winser -r -n ${serviceName}`, { stdio: 'inherit' });
  } catch (e) {
    // Service might not be installed via winser, try sc delete
    try {
      execSync(`sc stop ${serviceName}`, { stdio: 'ignore' });
      execSync(`sc delete ${serviceName}`, { stdio: 'ignore' });
    } catch (err) {
      // Ignore errors
    }
  }
  
  // Install/update service
  execSync(`winser -i -s -n ${serviceName} --description "${serviceDescription}"`, { 
    stdio: 'inherit',
    cwd: __dirname,
    env: { ...process.env, NODE_ENV: 'development', PORT: '5174' }
  });
  
  console.log('✓ Service updated successfully!');
  console.log(`Service name: ${serviceName}`);
  console.log('You can manage the service using:');
  console.log(`  - Start: sc start ${serviceName}`);
  console.log(`  - Stop: sc stop ${serviceName}`);
  console.log(`  - Status: sc query ${serviceName}`);
  
} catch (error) {
  // Service does not exist, create new one
  console.log('Service does not exist');
  console.log('Creating new service...');
  
  try {
    execSync(`winser -i -s -n ${serviceName} --description "${serviceDescription}"`, { 
      stdio: 'inherit',
      cwd: __dirname,
      env: { ...process.env, NODE_ENV: 'development', PORT: '5174' }
    });
    
    console.log('✓ Service created successfully!');
    console.log(`Service name: ${serviceName}`);
    console.log('Service will start automatically on Windows startup');
    
  } catch (installError) {
    console.error('✗ Failed to install service:', installError.message);
    console.error('Make sure you are running as Administrator');
    process.exit(1);
  }
}

console.log('='.repeat(60));

