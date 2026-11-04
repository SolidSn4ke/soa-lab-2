
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Project paths
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = path.resolve(SCRIPT_DIR, '..');
const WAR_FILE = path.join(PROJECT_DIR, 'target', 'discipline-service.war');
const START_SCRIPT = path.join(PROJECT_DIR, 'server', 'start.sh');

// Load environment
const ENV_FILE = path.join(PROJECT_DIR, '.env');

if (!existsSync(ENV_FILE)) {
    throw new Error('.env file not found');
}

process.loadEnvFile(ENV_FILE);

// Configuration
const {
    SSH_HOST,
    SSH_USER,
    SSH_PORT,
    REMOTE_DIR,
    JETTY_HOME,
    JETTY_BASE,
    JETTY_PORT,
    JETTY_DEPLOY_MODULES,
    LABWORK_SERVICE_URL,
} = process.env;

const requiredVariables = {
    SSH_HOST,
    SSH_USER,
    SSH_PORT,
    REMOTE_DIR,
    JETTY_HOME,
    JETTY_BASE,
    JETTY_PORT,
    JETTY_DEPLOY_MODULES,
    LABWORK_SERVICE_URL,
};

for (const [name, value] of Object.entries(requiredVariables)) {
    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }
}

if (!/^\d+$/.test(SSH_PORT) || Number(SSH_PORT) < 1 || Number(SSH_PORT) > 65535) {
    throw new Error('Invalid SSH_PORT');
}

if (!/^\d+$/.test(JETTY_PORT) || Number(JETTY_PORT) < 1 || Number(JETTY_PORT) > 65535) {
    throw new Error('Invalid JETTY_PORT');
}

const SSH_TARGET = `${SSH_USER}@${SSH_HOST}`;

// Helpers
function run(command, args, options = {}) {
    console.log(`\n> ${command} ${args.join(' ')}`);

    const result = spawnSync(command, args, {
        cwd: PROJECT_DIR,
        stdio: 'inherit',
        ...options,
    });

    if (result.error) {
        throw result.error;
    }

    if (result.status !== 0) {
        throw new Error(`Command failed: ${command}`);
    }
}

function shellQuote(value) {
    return `'${String(value).replace(/'/g, "'\\''")}'`;
}

// Step 1. Build WAR
function build() {
    console.log('\n=== Building application ===');

    const isWindows = process.platform === 'win32';
    const command = isWindows ? 'mvn.cmd' : 'mvn';

    run(command, ['clean', 'package'], {
        shell: isWindows,
    });

    if (!existsSync(WAR_FILE)) {
        throw new Error('WAR file was not created');
    }
}

// Step 2. Configure Jetty on Helios
function configureServer() {
    console.log('\n=== Configuring Jetty on Helios ===');

    const remoteScript = `
set -e

REMOTE_DIR=${shellQuote(REMOTE_DIR)}
JETTY_HOME=${shellQuote(JETTY_HOME)}
JETTY_BASE=${shellQuote(JETTY_BASE)}
JETTY_PORT=${shellQuote(JETTY_PORT)}
JETTY_DEPLOY_MODULES=${shellQuote(JETTY_DEPLOY_MODULES)}

mkdir -p "$REMOTE_DIR"
mkdir -p "$JETTY_BASE"

if [ ! -f "$JETTY_HOME/start.jar" ]; then
    echo "Jetty start.jar not found: $JETTY_HOME/start.jar"
    exit 1
fi

mkdir -p "$JETTY_BASE/webapps"
mkdir -p "$JETTY_BASE/logs"

cd "$JETTY_BASE"

java -jar "$JETTY_HOME/start.jar" \\
    --add-modules="http,$JETTY_DEPLOY_MODULES"

cat > "$JETTY_BASE/start.d/http.ini" <<EOF
--module=http
jetty.http.port=$JETTY_PORT
EOF

cat > "$REMOTE_DIR/jetty.env" <<EOF
JETTY_HOME=$JETTY_HOME
JETTY_BASE=$JETTY_BASE
EOF

cat > "$REMOTE_DIR/application.env" <<EOF
LABWORK_SERVICE_URL=${shellQuote(LABWORK_SERVICE_URL)}
EOF

echo "Jetty configuration completed."
`;

    run('ssh', [
        '-p', SSH_PORT,
        SSH_TARGET,
        `bash -lc ${shellQuote(remoteScript)}`,
    ]);
}

// Step 3. Upload files
function uploadFiles() {
    console.log('\n=== Uploading files ===');

    run('scp', [
        '-P', SSH_PORT,
        WAR_FILE,
        `${SSH_TARGET}:${JETTY_BASE}/webapps/discipline-service.war`,
    ]);

    run('scp', [
        '-P', SSH_PORT,
        START_SCRIPT,
        `${SSH_TARGET}:${REMOTE_DIR}/start.sh`,
    ]);
}

// Step 4. Set permissions
function setPermissions() {
    console.log('\n=== Setting permissions ===');

    const remoteCommand = `
chmod +x ${shellQuote(`${REMOTE_DIR}/start.sh`)}
echo "Permissions configured."
`;

    run('ssh', [
        '-p', SSH_PORT,
        SSH_TARGET,
        `bash -lc ${shellQuote(remoteCommand)}`,
    ]);
}

// Main
function deploy() {
    console.log('================================');
    console.log('   Discipline Service Deploy');
    console.log('================================');

    if (!existsSync(START_SCRIPT)) {
        throw new Error(`Start script not found: ${START_SCRIPT}`);
    }

    build();
    configureServer();
    uploadFiles();
    setPermissions();

    console.log('\n================================');
    console.log('Deployment completed successfully!');
    console.log(`Remote directory: ${REMOTE_DIR}`);
    console.log(`Jetty port: ${JETTY_PORT}`);
    console.log('Run ./start.sh on Helios to start the service.');
    console.log('================================');
}

deploy();
