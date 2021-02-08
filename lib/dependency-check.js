const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { program } = require('commander');
const { isReady, install, getExecutable } = require("./cli");
const { getBinDir, cleanDir } = require('./utils');

const envOwaspBin = process.env.OWASP_BIN;

function getCmdArguments() {
  const args = [
    `--project ${program.project}`,
    `--out ${program.out}`,
    ...program.scan.map(s => `--scan ${s}`),
    ...program.format.map(f => `--format ${f}`),
  ];

  return args.join(' ');
}

function runCheck(forceExecutable) {
  console.log('owasp-dependency-check: Running the dependency check ...');

  cleanDir(path.resolve(process.cwd(), program.out));

  const executable = forceExecutable || getExecutable();
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
  if (envOwaspBin && fs.existsSync(envOwaspBin)) {
    console.log('owasp-dependency-check: Found local instalation (OWASP_BIN), using it.');
    runCheck(envOwaspBin);
    return;
  }

  const binDir = getBinDir();

  if (program.forceInstall || !isReady(binDir)) {
    console.log('owasp-dependency-check: Downloading the dependency-check executables ...');
    await install(binDir);
  }

  runCheck();
}

module.exports = {
  run,
};
