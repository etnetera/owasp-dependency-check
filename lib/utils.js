const path = require('path');
const rimraf = require('rimraf');
const { program } = require('commander');

function getBinDir() {
  return path.resolve(process.cwd(), program.bin);
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

async function cleanDir(dir) {
  const cleanErr = await rimrafPromise(dir);

  if (cleanErr) {
    console.error(cleanErr);
    return;
  }
}

module.exports = {
  getBinDir,
  rimrafPromise,
  cleanDir,
};
