'use strict';

const https = require('https');

/**
 * Check if repository has Dependabot enabled
 * @param {Object} repo - Repository configuration
 * @returns {Promise<boolean>} - Whether Dependabot is enabled
 */
async function checkDependabotEnabled(repo) {
  const url = `https://api.github.com/repos/${repo.owner}/${repo.repo}/contents/.github/dependabot.yml`;
  
  const options = {
    method: 'HEAD',
    headers: {
      'User-Agent': 'openjs-security-monitor',
    }
  };
  
  console.log(`🔍 Checking if ${repo.name} uses Dependabot...`);
  
  return new Promise((resolve) => {
    const req = https.request(url, options, (res) => {
      const hasDependabot = res.statusCode === 200;
      if (hasDependabot) {
        console.log(`✅ ${repo.name} has Dependabot configured`);
      } else {
        console.log(`⚠️ ${repo.name} does not have Dependabot configuration`);
      }
      resolve(hasDependabot);
    });
    
    req.on('error', () => {
      console.log(`⚠️ Could not determine if ${repo.name} uses Dependabot`);
      resolve(false);
    });
    
    req.end();
  });
}

module.exports = checkDependabotEnabled;
