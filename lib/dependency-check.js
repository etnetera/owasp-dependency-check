const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const spawn = require('cross-spawn');
const { program } = require('commander');
const colors = require('colors');
const { getBinDir, cleanDir, getCmdArguments, log, getExecutable, isReady, install } = require('./utils');

function runCheck(executable) {
  cleanDir(path.resolve(process.cwd(), program.opts().out));

  const execOpts = {
    cwd: path.resolve(process.cwd()),
    maxBuffer: 1024 * 1024 * 50,
  };

  const spawnOpts = {
    cwd: path.resolve(process.cwd()),
    shell: false,
    stdio: 'inherit'
  };

  const cmdVersion = `${executable} --version`;
  const cmdArguments = getCmdArguments();
  const cmd = `${executable} ${cmdArguments.join(' ')}`;

  exec(cmdVersion, execOpts, (err, _stdout, _stderr) => {
    if (err || _stderr) {
      console.error(err || _stderr);
      return;
    }

    const versionMatch = _stdout.match(/[^\d]* (\d+\.\d+\.\d+).*/);

    log('Dependency-Check Core path:', executable);
    log('Dependency-Check Core version:', versionMatch ? versionMatch[1] : _stdout);

    log('Running command:\n', cmd);

    const exececutableSpawn = spawn(executable, cmdArguments, spawnOpts);
    exececutableSpawn.on('close', () => {
      log('Done.'.green);
    });
  });
}

async function run() {
  const envOwaspBin = process.env.OWASP_BIN;

  if (envOwaspBin && fs.existsSync(envOwaspBin)) {
    log('Localy preinstalled (OWASP_BIN) Dependency-Check Core found.');
    runCheck(envOwaspBin);
    return;
  }

  const binDir = getBinDir();

  if (program.opts().forceInstall || !isReady(binDir)) {
    log('No Dependency-Check Core executable found. Downloading into:', binDir);
    await install(binDir);
    log('Download done.');
  }

  runCheck(getExecutable());
}

module.exports = {
  run,
};
