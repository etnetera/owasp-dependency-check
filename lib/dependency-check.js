const path = require('path');
const { exec } = require('child_process');
const { program } = require('commander');
const { isReady, install, getExecutable } = require("./cli");
const { getBinDir, cleanDir } = require('./utils');

function getCmdArguments() {
  const args = [
    `--project ${program.project}`,
    `--out ${program.out}`,
    ...program.scan.map(s => `--scan ${s}`),
    ...program.format.map(f => `--format ${f}`),
  ];

  return args.join(' ');
}

function runCheck() {
  console.log('owasp-dependency-check: Running the dependency check ...');

  cleanDir(path.resolve(process.cwd(), program.out));

  const executable = getExecutable();
  const opts = {
    cwd: path.resolve(process.cwd()),
    maxBuffer: 1024 * 1024 * 50,
  };

  const cmd = `${executable} ${getCmdArguments()}`;

  exec(cmd, opts, (err, _stdout, _stderr) => {
    if (err || _stderr) {
      console.error(err || _stderr);
      return;
    }

    console.log('owasp-dependency-check: Done.');
  })
}

async function run() {
  const binDir = getBinDir();

  if (program.forceInstall || !isReady(binDir)) {
    await install(binDir);
  }

  runCheck();
}

module.exports = {
  run,
};
