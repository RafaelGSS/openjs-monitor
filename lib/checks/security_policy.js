'use strict';

const https = require('https');

/**
 * Check if a repo has GitHub Security Policy enabled
 * @param {Object} repo - Repository configuration
 * @returns {Promise<boolean>} - Whether security policy is enabled
 */
async function checkGitHubSecurityPolicy(repo) {
  const url = `https://api.github.com/repos/${repo.owner}/${repo.repo}/security/advisories`;
  
  const options = {
    method: 'GET',
    headers: {
      'User-Agent': 'openjs-security-monitor',
    }
  };
  
  console.log(`🔍 Checking if ${repo.name} has GitHub Security Policy enabled...`);
  
  return new Promise((resolve) => {
    https.get(url, options, (res) => {
      const hasSecurityPolicy = res.statusCode === 200;
      if (hasSecurityPolicy) {
        console.log(`✅ ${repo.name} has GitHub Security Policy enabled`);
      } else {
        console.log(`⚠️ ${repo.name} does not have GitHub Security Policy enabled`);
      }
      resolve(hasSecurityPolicy);
    }).on('error', () => {
      console.log(`❌ Error checking GitHub Security Policy for ${repo.name}`);
      resolve(false);
    });
  });
}

module.exports = checkGitHubSecurityPolicy;
