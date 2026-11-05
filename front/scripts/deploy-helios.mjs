import { spawnSync } from 'node:child_process';

process.loadEnvFile('.env');

const {
    BASE_HREF,
    SSH_HOST,
    SSH_PORT,
    SSH_USER,
    REMOTE_PATH,
    REMOTE_DISCIPLINE_CERT,
    REMOTE_API_CERT_DIR
} = process.env;

if (!BASE_HREF || !SSH_HOST || !SSH_USER || !SSH_PORT || !REMOTE_PATH || !REMOTE_DISCIPLINE_CERT || !REMOTE_API_CERT_DIR) {
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

function runRemoteScript(script) {
    const result = spawnSync(
        'ssh',
        ['-p', SSH_PORT, `${SSH_USER}@${SSH_HOST}`, 'bash -s'],
        {
            input: script,
            stdio: ['pipe', 'inherit', 'inherit']
        }
    );

    if (result.error) {
        throw result.error;
    }

    if (result.status !== 0) {
        throw new Error('Remote script execution failed');
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

// 3. Copy Jetty certificate to PHP API directory
console.log('\nCopying Jetty certificate...');

runRemoteScript(`
set -e

REMOTE_DISCIPLINE_CERT='${REMOTE_DISCIPLINE_CERT}'
REMOTE_API_CERT_DIR='${REMOTE_API_CERT_DIR}'

if [ ! -r "$REMOTE_DISCIPLINE_CERT" ]; then
    echo "Certificate not found or not readable: $REMOTE_DISCIPLINE_CERT"
    exit 1
fi

mkdir -p "$REMOTE_API_CERT_DIR"

cp "$REMOTE_DISCIPLINE_CERT" "$REMOTE_API_CERT_DIR/jetty.crt"
chmod 644 "$REMOTE_API_CERT_DIR/jetty.crt"

echo "Jetty certificate copied successfully."
`);

console.log('\nDeployment completed!');