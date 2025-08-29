# OpenJS Security Monitor

A security monitoring tool for tracking security practices of top OpenJS Foundation packages.

## Features

- **SECURITY.md Monitoring**: Checks for the presence and tracks changes to SECURITY.md files in repositories
- **Security Best Practices**: Evaluates repositories against security best practices
- **Download Statistics**: Tracks weekly download counts of packages
- **Change Detection**: Detects changes in security documentation
- **Reporting**: Generates detailed reports in JSON format

## Monitored Packages

Currently monitors these OpenJS Foundation packages:

1. **Node.js** (nodejs/node)
2. **Express** (expressjs/express)
3. **webpack** (webpack/webpack)

## Installation

```bash
git clone https://github.com/your-username/openjs-security-monitor.git
cd openjs-security-monitor
npm install
```

## Usage

Run the monitor:

```bash
node monitor.js
```

This will:
1. Check for SECURITY.md files in each repository
2. Track any changes to these files
3. Analyze the content for security best practices
4. Fetch npm download statistics
5. Generate a report in `security_report.json`

## Report Information

The script checks for and reports on:

- Existence of SECURITY.md
- Changes to SECURITY.md from previous run
- Mentions of vulnerability reporting process
- Mentions of disclosure policy
- Security contact information
- GitHub security policy status
- Weekly download statistics from npm

## Directory Structure

- `/cache`: Stores cached copies of security files
- `/checksums`: Stores checksums for change detection
- `/lib`: Contains modular components
  - `securitymd_check.js`: Handles SECURITY.md file checks and analysis
  - `npm_stats.js`: Manages npm package statistics collection
  - `security_practices.js`: Evaluates security best practices
  - `formatter.js`: Handles console output formatting
- `monitor.js`: Main script that coordinates all modules
- `security_report.json`: Contains the latest monitoring report

## How Change Detection Works

The script works by:
1. Fetching the current SECURITY.md from each repository
2. Generating a SHA-256 checksum of the content
3. Comparing with previously stored checksum (if available)
4. Reporting if changes are detected

## Adding More Repositories

To monitor additional repositories, add entries to the `REPOSITORIES` array in `monitor.js`:

```javascript
{
  name: 'Package Name',
  owner: 'github-owner',
  repo: 'repo-name',
  securityFilePath: 'SECURITY.md',
  branch: 'main',
  npmPackage: 'package-name'
}
```

## License

MIT
