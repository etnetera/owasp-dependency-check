const os = require('os');
const fs = require('fs');
const path = require('path');
const download = require('download');
const extract = require('extract-zip');
const fetch = require('node-fetch');
const { getBinDir, cleanDir } = require('./utils');

const IS_WIN = os.platform() === 'win32';
const NAME_RE = /^dependency\-check\-\d\.\d\.\d\-release\.zip$/;
const RELEASE_URL = 'https://api.github.com/repos/jeremylong/DependencyCheck/releases/latest';

function getExecutable() {
  const binDir = getBinDir();

  return path.resolve(binDir, 'dependency-check', 'bin', `dependency-check.${IS_WIN ? 'bat' : 'sh'}`);
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

  await download(asset.browser_download_url, binDir, {
    filename: asset.name,
  });

  await extract(path.resolve(binDir, asset.name), {
    dir: binDir,
  });
}

module.exports = {
  getExecutable,
  isReady,
  install,
};
