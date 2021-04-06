#!/usr/bin/env node

const { program } = require('commander');
const { run } = require('./lib/dependency-check');

program
  .option('--project <name>', 'the project name (required)')
  .option('-s, --scan [paths...]', 'the path to scan, multiple paths separated by space', ['.'])
  .option('-f, --format [formats...]', 'the output format, multiple formats separated by space (XML, HTML, CSV, JSON, JUNIT, ALL)', ['HTML', 'JSON'])
  .option('-o, --out <path>', 'the folder to write reports to', './dependency-check-reports')
  .option('--bin <path>', 'directory to which the dependency-check CLI will be installed', './dependency-check-bin')
  .option('--force-install', 'install the dependency-check CLI even if there already is one (will be overwritten)');

program.parse(process.argv);

run();
