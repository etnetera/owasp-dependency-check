const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { program } = require('commander');
const { isReady, install, getExecutable } = require("./cli");
const { getBinDir, cleanDir, getCmdArguments } = require('./utils');

function runCheck(executable) {
  cleanDir(path.resolve(process.cwd(), program.opts().out));

  const opts = {
    cwd: path.resolve(process.cwd()),
    maxBuffer: 1024 * 1024 * 50,
  };

  const cmd = `${executable} ${getCmdArguments()}`;

  console.log('owasp-dependency-check: Running the dependency check ...');
  console.log(cmd);

  exec(cmd, opts, (err, _stdout, _stderr) => {
    if (err || _stderr) {
      console.error(err || _stderr);
      return;
    }

    console.log('owasp-dependency-check: Done.');
  })
}

async function run() {
  const envOwaspBin = process.env.OWASP_BIN;
  
  if (envOwaspBin && fs.existsSync(envOwaspBin)) {
    console.log('owasp-dependency-check: Found local instalation (OWASP_BIN), using it.');
    runCheck(envOwaspBin);
    return;
  }

  const binDir = getBinDir();

  if (program.opts().forceInstall || !isReady(binDir)) {
    console.log('owasp-dependency-check: Downloading the dependency-check executables ...');
    await install(binDir);
  }

  runCheck(getExecutable());
}

module.exports = {
  run,
};
