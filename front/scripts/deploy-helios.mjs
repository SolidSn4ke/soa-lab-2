import { spawnSync } from 'node:child_process';

process.loadEnvFile('.env');

const {
    BASE_HREF,
    SSH_HOST,
    SSH_PORT,
    SSH_USER,
    REMOTE_PATH
} = process.env;

if (!BASE_HREF || !SSH_HOST || !SSH_USER || !SSH_PORT || !REMOTE_PATH) {
    console.error('Missing configuration in .env');
    process.exit(1);
}

function run(command, args) {
    const result = spawnSync(command, args, {
        stdio: 'inherit',
        shell: process.platform === 'win32'
    });

    if (result.status !== 0) {
        process.exit(result.status ?? 1);
    }
}

// 1. Build
console.log('\nBuilding Angular application...');

run('npx', [
    'ng',
    'build',
    '--configuration',
    'production,helios',
    '--base-href',
    BASE_HREF
]);

// 2. Deploy
const distPath = 'dist/front/browser/';

console.log('\nUploading files to server...');

run('ssh', [
    '-p', SSH_PORT,
    `${SSH_USER}@${SSH_HOST}`,
    `mkdir -p "${REMOTE_PATH}"`
]);

run('scp', [
    '-P', SSH_PORT,
    '-r',
    `${distPath}.`,
    `${SSH_USER}@${SSH_HOST}:${REMOTE_PATH}`
]);

console.log('\nDeployment completed!');