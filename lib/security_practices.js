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

/**
 * Comprehensive security practices check for a repository
 * @param {Object} repo - Repository configuration
 */
async function check(repo) {
  console.log(`
🛡️  Analyzing security best practices for ${repo.name}...`);
  
  try {
    // Run each check independently instead of waiting for all to complete
    checkGitHubSecurityPolicy(repo);
    checkDependabotEnabled(repo);
    checkCodeScanningEnabled(repo);
    checkSecurityAdvisories(repo);
  } catch (error) {
    console.error(`❌ Error checking security practices for ${repo.name}:`, error);
  }
}

module.exports = {
  check,
  checkGitHubSecurityPolicy,
  checkDependabotEnabled,
  checkCodeScanningEnabled,
  checkSecurityAdvisories
};
