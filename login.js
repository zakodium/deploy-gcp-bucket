'use strict';

require('make-promises-safe');
const fs = require('fs');
const execa = require('execa');

const keyPath = '/gcp-key.json';

exec();

async function exec() {
  await verifyAuth();
  if (!fs.existsSync(keyPath)) {
    console.error(`Key file must be present at ${keyPath}`);
    process.exit(1);
  }
  await doAuth();
  console.log('Logged in successfully');
}

async function verifyAuth() {
  const result = await execa('gcloud', ['auth', 'list']);
  if (!result.stderr.includes('No credentialed accounts')) {
    console.error('You are already logged in');
    process.exit(1);
  }
}

async function doAuth() {
  await execa('gcloud', [
    'auth',
    'activate-service-account',
    '--key-file',
    keyPath
  ]);
}
