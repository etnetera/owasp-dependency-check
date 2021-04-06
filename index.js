#!/usr/bin/env node

const { program } = require('commander');
const { run } = require('./lib/dependency-check');

program
  .option('--project <name>', 'the project name (required)')
  .option('-s, --scan [paths...]', 'the path to scan, multiple paths separated by space', ['.'])
  .option('-f, --format [formats...]', 'the output format, multiple formats separated by space (XML, HTML, CSV, JSON, JUNIT, ALL)', ['HTML', 'JSON'])
  .option('-o, --out <path>', 'the folder to write reports to', './dependency-check-reports')
  .option('--cveUrlBase <url>', 'Base URL for each year’s CVE JSON data feed, the %d will be replaced with the year.', 'https://nvd.nist.gov/feeds/json/cve/1.1/nvdcve-1.1-%d.json.gz')
  .option('--cveUrlModified <url>', 'URL for the modified CVE JSON data feed. When mirroring the NVD you must mirror the *.json.gz and the *.meta files.', 'https://nvd.nist.gov/feeds/json/cve/1.1/nvdcve-1.1-modified.json.gz')
  .option('--bin <path>', 'directory to which the dependency-check CLI will be installed', './dependency-check-bin')
  .option('--force-install', 'install the dependency-check CLI even if there already is one (will be overwritten)');

program.parse(process.argv);

run();
