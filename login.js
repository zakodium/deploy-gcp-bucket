import fs from 'fs';

import execa from 'execa';

const keyPath = '/gcp-key.json';

// Verify auth
const result = await execa('gcloud', ['auth', 'list']);
if (!result.stderr.includes('No credentialed accounts')) {
  console.error('You are already logged in');
  process.exit(0);
}

// Verify existence of key file
if (!fs.existsSync(keyPath)) {
  console.error(`Key file must be present at ${keyPath}`);
  process.exit(1);
}

// Do auth
await execa('gcloud', [
  'auth',
  'activate-service-account',
  '--key-file',
  keyPath,
]);
console.log('Logged in successfully');
