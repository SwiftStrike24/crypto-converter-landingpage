// Bundle analyzer script for Next.js
// Run with: node analyze-bundle.mjs

import { execSync } from 'child_process';
import fs from 'fs';

// Create a temporary next.config.js with bundle analyzer
const originalConfig = fs.readFileSync('./next.config.js', 'utf8');
const analyzerConfig = `
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: true,
});

${originalConfig.replace('module.exports = nextConfig;', 'module.exports = withBundleAnalyzer(nextConfig);')}
`;

// Write the temporary config
fs.writeFileSync('./next.config.analyzer.js', analyzerConfig);

try {
  // Rename files
  fs.renameSync('./next.config.js', './next.config.original.js');
  fs.renameSync('./next.config.analyzer.js', './next.config.js');
  
  console.log('Running Next.js build with bundle analyzer...');
  
  // Run the build
  execSync('npm run build', { stdio: 'inherit' });
  
} catch (error) {
  console.error('Error during analysis:', error);
} finally {
  // Restore original config
  if (fs.existsSync('./next.config.original.js')) {
    if (fs.existsSync('./next.config.js')) {
      fs.unlinkSync('./next.config.js');
    }
    fs.renameSync('./next.config.original.js', './next.config.js');
    console.log('Restored original next.config.js');
  }
} 