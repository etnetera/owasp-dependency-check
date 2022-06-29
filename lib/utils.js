const os = require('os');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const { program } = require('commander');
const colors = require('colors');
const { mkdir } = require('fs/promises');
const fetch = require('node-fetch');
const Downloader = require('nodejs-file-downloader');
const extract = require('extract-zip');

const IS_WIN = os.platform() === 'win32';
const NAME_RE = /^dependency\-check\-\d\.\d\.\d\-release\.zip$/;
const RELEASE_URL = 'https://api.github.com/repos/jeremylong/DependencyCheck/releases/latest';

function getBinDir() {
  return path.resolve(process.cwd(), program.opts().bin);
}

function getCmdArguments() {
  const args = [
    `--out=${program.opts().out}`,
    ...program.args
  ];

  if (!hasCmdArg(args, '--project')) {
    args.push(`--project="${getProjectName()}"`);
  }

  if (!hasCmdArg(args, '-d') && !hasCmdArg(args, '--data')) {
    args.push('--data=/tmp/dependency-check-data');
  }

  if (!hasCmdArg(args, '-f') && !hasCmdArg(args, '--format')) {
    args.push('--format=HTML');
    args.push('--format=JSON');
  }

  if (!hasCmdArg(args, '-s') && !hasCmdArg(args, '--scan')) {
    args.push('--scan=package-lock.json');
  }

  return args.join(' ');
}

function getExecutable() {
  const binDir = getBinDir();

  return path.resolve(binDir, 'dependency-check', 'bin', `dependency-check.${IS_WIN ? 'bat' : 'sh'}`);
}

async function cleanDir(dir) {
  const cleanErr = await rimrafPromise(dir);

  if (cleanErr) {
    console.error(cleanErr);
    return;
  }

  await mkdir(dir);
}

function isReady() {
  return fs.existsSync(getExecutable());
}

async function install() {
  const binDir = getBinDir();

  cleanDir(binDir);

  const res = await fetch(RELEASE_URL);
  const json = await res.json();

  const asset = json.assets.find(a => NAME_RE.test(a.name));
  const downloader = new Downloader({
    url: asset.browser_download_url,
    directory: binDir,
    fileName: asset.name,
  });
  await downloader.download();

  await extract(path.resolve(binDir, asset.name), {
    dir: binDir,
  });
}

function rimrafPromise(dir) {
  return new Promise((resolve, reject) => {
    rimraf(dir, err => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

function getProjectName() {
  let projectName = process.env.PROJECT_NAME;

  if (!projectName) {
    try {
      const pckg = require(path.resolve(process.cwd(), 'package.json'));
      projectName = pckg.name;
    }
    catch (e) {
      console.error(e);
    }
  }

  return projectName;
}

function hasCmdArg(args, argPrefix) {
  return args.find(arg => arg.startsWith(`${argPrefix}=`) || arg.startsWith(`${argPrefix} `) || arg === argPrefix);
}

function log(...logData) {
  if (!logData) {
    return;
  }

  console.log([
    'owasp-dependency-check:'.bgGreen.black,
    ...logData,
  ].join(' '));
}

module.exports = {
  getBinDir,
  getCmdArguments,
  getExecutable,
  cleanDir,
  isReady,
  install,
  rimrafPromise,
  log,
};
