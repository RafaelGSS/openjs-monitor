'use strict';

const https = require('https');

/**
 * Check if a repository has security advisories
 * @param {Object} repo - Repository configuration
 * @returns {Promise<Object>} - Security advisories information
 */
async function checkSecurityAdvisories(repo) {
  const url = `https://api.github.com/repos/${repo.owner}/${repo.repo}/security-advisories`;
  
  const options = {
    method: 'GET',
    headers: {
      'User-Agent': 'openjs-security-monitor',
    }
  };
  
  console.log(`🔍 Checking security advisories for ${repo.name}...`);
  
  return new Promise((resolve) => {
    https.get(url, options, (res) => {
      if (res.statusCode !== 200) {
        console.log(`⚠️ Could not fetch security advisories for ${repo.name}`);
        resolve({ error: `Status code: ${res.statusCode}` });
        return;
      }
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const advisories = JSON.parse(data);
          console.log(`✅ Retrieved ${advisories.length} security advisories for ${repo.name}`);
          resolve({
            count: advisories.length,
            advisories
          });
        } catch (error) {
          console.log(`❌ Error parsing security advisories for ${repo.name}`);
          resolve({ error: error.message });
        }
      });
    }).on('error', (error) => {
      console.log(`❌ Error fetching security advisories for ${repo.name}`);
      resolve({ error: error.message });
    });
  });
}

module.exports = checkSecurityAdvisories;
