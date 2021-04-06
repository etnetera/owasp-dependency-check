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

function getProjectName() {
  let projectName = program.project || process.env.PROJECT_NAME;

  if (!projectName) {
    try {
      const pckg = require(path.resolve(process.cwd(), 'package.json'));
      projectName = pckg.name;
    }
    catch (e) {
      console.log(e);
    }
  }

  return projectName;
}

function getCmdArguments() {
  const args = [
    `--project ${getProjectName()}`,
    `--out ${program.out}`,
    ...program.scan.map(s => `--scan ${s}`),
    ...program.format.map(f => `--format ${f}`),
  ];

  return args.join(' ');
}

module.exports = {
  getBinDir,
  rimrafPromise,
  cleanDir,
  getCmdArguments,
};
