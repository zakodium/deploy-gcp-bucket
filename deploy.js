'use strict';

require('make-promises-safe');
const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;
const execa = require('execa');
const envalid = require('envalid');

const version = process.argv[2];
if (!version) {
  console.error('usage: node deploy.js <version>');
  process.exit(1);
}

const { str } = envalid;
const {
  DEPLOY_BUCKET_NAME,
  DEPLOY_DIRECTORY,
  DEPLOY_SYMLINK
} = envalid.cleanEnv(
  process.env,
  {
    DEPLOY_BUCKET_NAME: str(),
    DEPLOY_DIRECTORY: str(),
    DEPLOY_SYMLINK: str()
  },
  {
    strict: true
  }
);

const root = '/data';
const releaseDir = path.join(root, DEPLOY_DIRECTORY);
const symlinkPath = path.join(root, DEPLOY_SYMLINK);

exec();

async function exec() {
  await fsPromises.mkdir(releaseDir, { recursive: true });

  await verifyAuth();

  console.log(`Deploying ${version}`);
  const exec = execa('gsutil', [
    'rsync',
    '-r',
    '-d',
    `gs://${DEPLOY_BUCKET_NAME}`,
    releaseDir
  ]);
  exec.stdout.pipe(process.stdout);
  await exec;

  const exists = await versionExists();

  if (!exists) {
    console.error(`Release ${version} does not exist`);
    process.exit(1);
  }

  // Remove previous symlink if exists
  try {
    await fsPromises.unlink(symlinkPath);
  } catch (e) {
    if (e.code !== 'ENOENT') {
      console.error(e.message);
      process.exit(1);
    }
  }

  // Create new symlink
  const relativePath = path.relative(root, path.join(releaseDir, version));
  console.log(`Creating symlink for ${version}`);
  await fsPromises.symlink(relativePath, symlinkPath);

  console.log('Finished');
}

async function versionExists() {
  return fs.existsSync(path.join(releaseDir, version));
}

async function verifyAuth() {
  const result = await execa('gcloud', ['auth', 'list']);
  if (result.stderr && result.stderr.includes('No credentialed accounts.')) {
    console.error('You need to run the login command first.');
    process.exit(1);
  }
}
