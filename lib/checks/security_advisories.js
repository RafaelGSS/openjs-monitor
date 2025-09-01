'use strict';

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

  return fetch(url, options)
    .then(res => {
      if (res.status === 404) {
        console.log(`⚠️ ${repo.name} does not have security advisories`);
        return { error: `Not found: ${res.status}` };
      } else if (res.status !== 200) {
        console.log(`⚠️ Error: ${res.status} when fetching security advisories for ${repo.name}`);
        return { error: `Status code: ${res.status}` };
      }
      return res.json()
        .then(advisories => {
          console.log(`✅ Retrieved ${advisories.length} security advisories for ${repo.name}`);
          return {
            count: advisories.length,
            advisories
          };
        })
        .catch(error => {
          console.log(`❌ Error parsing security advisories for ${repo.name}`);
          return { error: error.message };
        });
    })
    .catch(error => {
      console.log(`❌ Error fetching security advisories for ${repo.name}: ${error.message}`);
      return { error: error.message };
    });
}

module.exports = checkSecurityAdvisories;
