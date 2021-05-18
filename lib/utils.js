const path = require('path');
const rimraf = require('rimraf');
const { program } = require('commander');

function getBinDir() {
  return path.resolve(process.cwd(), program.opts().bin);
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
  let projectName = process.env.PROJECT_NAME;

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

function hasCmdArg(args, argPrefix) {
  return args.find(arg => arg.startsWith(`${argPrefix}=`) || arg.startsWith(`${argPrefix} `) || arg === argPrefix);
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

module.exports = {
  getBinDir,
  rimrafPromise,
  cleanDir,
  getCmdArguments,
};
