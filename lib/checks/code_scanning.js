'use strict';

const https = require('https');

/**
 * Check if repository has Code Scanning (CodeQL) enabled
 * @param {Object} repo - Repository configuration
 * @returns {Promise<boolean>} - Whether Code Scanning is enabled
 */
async function checkCodeScanningEnabled(repo) {
  const url = `https://api.github.com/repos/${repo.owner}/${repo.repo}/contents/.github/workflows/codeql-analysis.yml`;
  
  const options = {
    method: 'HEAD',
    headers: {
      'User-Agent': 'openjs-security-monitor',
    }
  };
  
  console.log(`🔍 Checking if ${repo.name} uses Code Scanning...`);
  
  return new Promise((resolve) => {
    const req = https.request(url, options, (res) => {
      const hasCodeScanning = res.statusCode === 200;
      if (hasCodeScanning) {
        console.log(`✅ ${repo.name} has CodeQL Code Scanning configured`);
      } else {
        console.log(`⚠️ ${repo.name} does not have CodeQL configuration`);
      }
      resolve(hasCodeScanning);
    });
    
    req.on('error', () => {
      console.log(`⚠️ Could not determine if ${repo.name} uses Code Scanning`);
      resolve(false);
    });
    
    req.end();
  });
}

module.exports = checkCodeScanningEnabled;
