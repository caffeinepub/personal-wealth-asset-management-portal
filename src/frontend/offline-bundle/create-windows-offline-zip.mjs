#!/usr/bin/env node

/**
 * Windows Offline Bundle Creator
 * 
 * This script creates a ZIP archive containing the complete static build
 * of the Personal Wealth & Asset Management platform for offline use on Windows.
 * 
 * Usage: node create-windows-offline-zip.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createWriteStream } from 'fs';
import archiver from 'archiver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load configuration
const configPath = path.join(__dirname, 'bundle.config.json');
let config;

try {
  const configContent = fs.readFileSync(configPath, 'utf-8');
  config = JSON.parse(configContent);
} catch (error) {
  console.error('❌ Failed to load bundle.config.json:', error.message);
  process.exit(1);
}

const {
  buildOutputDir = 'dist',
  outputZipName = 'wealth-portal-windows-offline.zip',
  defaultPort = 3000,
} = config;

// Resolve paths
const frontendRoot = path.resolve(__dirname, '..');
const buildDir = path.join(frontendRoot, buildOutputDir);
const outputZipPath = path.join(frontendRoot, outputZipName);
const bundleDir = __dirname;

console.log('🚀 Starting Windows Offline Bundle Creation...\n');

// Step 1: Validate build directory exists
console.log('📁 Validating build directory...');
if (!fs.existsSync(buildDir)) {
  console.error(`❌ Build directory not found: ${buildDir}`);
  console.error('   Please run "npm run build" first to generate the static build.');
  process.exit(1);
}

const buildFiles = fs.readdirSync(buildDir);
if (buildFiles.length === 0) {
  console.error(`❌ Build directory is empty: ${buildDir}`);
  console.error('   Please run "npm run build" first to generate the static build.');
  process.exit(1);
}

console.log(`✅ Build directory validated: ${buildDir}\n`);

// Step 2: Create ZIP archive
console.log('📦 Creating ZIP archive...');

const output = createWriteStream(outputZipPath);
const archive = archiver('zip', {
  zlib: { level: 9 } // Maximum compression
});

output.on('close', () => {
  const sizeInMB = (archive.pointer() / 1024 / 1024).toFixed(2);
  console.log(`✅ ZIP archive created successfully!`);
  console.log(`   File: ${outputZipPath}`);
  console.log(`   Size: ${sizeInMB} MB`);
  console.log(`\n🎉 Windows offline bundle is ready for download!`);
  console.log(`\n📝 Next steps:`);
  console.log(`   1. Extract the ZIP file on your Windows machine`);
  console.log(`   2. Read WINDOWS_RUN_INSTRUCTIONS.txt for setup instructions`);
  console.log(`   3. Run start-server-win.bat or start-server-win.ps1 to launch the app`);
});

output.on('error', (err) => {
  console.error('❌ Error creating ZIP archive:', err);
  process.exit(1);
});

archive.on('error', (err) => {
  console.error('❌ Error archiving files:', err);
  process.exit(1);
});

archive.on('warning', (err) => {
  if (err.code === 'ENOENT') {
    console.warn('⚠️  Warning:', err);
  } else {
    throw err;
  }
});

archive.pipe(output);

// Add build files to archive
console.log('   Adding build files...');
archive.directory(buildDir, 'app');

// Add Windows instructions
const instructionsPath = path.join(bundleDir, 'WINDOWS_RUN_INSTRUCTIONS.txt');
if (fs.existsSync(instructionsPath)) {
  console.log('   Adding WINDOWS_RUN_INSTRUCTIONS.txt...');
  archive.file(instructionsPath, { name: 'WINDOWS_RUN_INSTRUCTIONS.txt' });
} else {
  console.warn('⚠️  WINDOWS_RUN_INSTRUCTIONS.txt not found, skipping...');
}

// Add Windows batch launcher
const batchLauncherPath = path.join(bundleDir, 'start-server-win.bat');
if (fs.existsSync(batchLauncherPath)) {
  console.log('   Adding start-server-win.bat...');
  archive.file(batchLauncherPath, { name: 'start-server-win.bat' });
} else {
  console.warn('⚠️  start-server-win.bat not found, skipping...');
}

// Add Windows PowerShell launcher
const psLauncherPath = path.join(bundleDir, 'start-server-win.ps1');
if (fs.existsSync(psLauncherPath)) {
  console.log('   Adding start-server-win.ps1...');
  archive.file(psLauncherPath, { name: 'start-server-win.ps1' });
} else {
  console.warn('⚠️  start-server-win.ps1 not found, skipping...');
}

// Add README
const readmePath = path.join(bundleDir, 'README.txt');
if (fs.existsSync(readmePath)) {
  console.log('   Adding README.txt...');
  archive.file(readmePath, { name: 'README.txt' });
}

// Finalize the archive
archive.finalize();
