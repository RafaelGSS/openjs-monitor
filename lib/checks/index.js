'use strict';

const checkGitHubSecurityPolicy = require('./security_policy');
const checkDependabotEnabled = require('./dependabot');
const checkCodeScanningEnabled = require('./code_scanning');
const checkSecurityAdvisories = require('./security_advisories');
const { check: checkSecurityMd } = require('./securitymd_check');

/**
 * List of all security practice checks to run
 */
const CHECKS = [
  checkGitHubSecurityPolicy,
  checkDependabotEnabled,
  checkCodeScanningEnabled,
  checkSecurityAdvisories,
  checkSecurityMd
];

/**
 * Run all security practice checks for a repository
 * @param {Object} repo - Repository configuration
 */
async function runAll(repo) {
  console.log(`\n🛡️  Analyzing security best practices for ${repo.name}...`);
  
  try {
    // Run each check independently
    for (const check of CHECKS) {
      await check(repo);
    }
  } catch (error) {
    console.error(`❌ Error checking security practices for ${repo.name}:`, error);
  }
}

module.exports = {
  runAll,
  checkGitHubSecurityPolicy,
  checkDependabotEnabled,
  checkCodeScanningEnabled,
  checkSecurityAdvisories,
  checkSecurityMd,
  CHECKS
};
