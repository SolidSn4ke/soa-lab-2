
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
    JETTY_SSL_KEYSTORE,
    JETTY_SSL_PASSWORD,
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
    JETTY_SSL_KEYSTORE,
    JETTY_SSL_PASSWORD,
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

function runRemoteScript(script) {
    console.log(`\n> ssh -p ${SSH_PORT} ${SSH_TARGET} bash -s`);

    const result = spawnSync(
        'ssh',
        ['-p', SSH_PORT, SSH_TARGET, 'bash -s'],
        {
            cwd: PROJECT_DIR,
            input: script,
            stdio: ['pipe', 'inherit', 'inherit'],
        }
    );

    if (result.error) {
        throw result.error;
    }

    if (result.status !== 0) {
        throw new Error('Remote script execution failed');
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
JETTY_SSL_KEYSTORE=${shellQuote(JETTY_SSL_KEYSTORE)}
JETTY_SSL_PASSWORD=${shellQuote(JETTY_SSL_PASSWORD)}

mkdir -p "$REMOTE_DIR"
mkdir -p "$JETTY_BASE"

if [ ! -f "$JETTY_HOME/start.jar" ]; then
    echo "Jetty start.jar not found: $JETTY_HOME/start.jar"
    exit 1
fi

mkdir -p "$JETTY_BASE/webapps"
mkdir -p "$JETTY_BASE/logs"

# Limit memory for Java configuration commands
export _JAVA_OPTIONS="-Xms128m -Xmx512m -XX:MaxMetaspaceSize=256m"

cd "$JETTY_BASE"

mkdir -p "$JETTY_BASE/etc"
mkdir -p "$JETTY_BASE/start.d"
mkdir -p "$JETTY_BASE/webapps"
mkdir -p "$JETTY_BASE/logs"

# Enable SSL and HTTPS modules
java -jar "$JETTY_HOME/start.jar" \
    --add-modules="ssl,https,$JETTY_DEPLOY_MODULES"

# Generate a test keystore if it does not exist
case "$JETTY_SSL_KEYSTORE" in
    /*)
        echo "JETTY_SSL_KEYSTORE must be relative to JETTY_BASE"
        exit 1
        ;;
esac

KEYSTORE_PATH="$JETTY_BASE/$JETTY_SSL_KEYSTORE"

mkdir -p "$(dirname "$KEYSTORE_PATH")"

if [ ! -f "$KEYSTORE_PATH" ]; then
    echo "Generating self-signed test certificate..."

    keytool -genkeypair \
        -alias jetty \
        -keyalg RSA \
        -keysize 2048 \
        -validity 365 \
        -storetype PKCS12 \
        -keystore "$KEYSTORE_PATH" \
        -storepass "$JETTY_SSL_PASSWORD" \
        -keypass "$JETTY_SSL_PASSWORD" \
        -dname "CN=localhost" \
        -ext "SAN=dns:localhost,ip:127.0.0.1" \
        -noprompt
fi

chmod 600 "$KEYSTORE_PATH"

# Export public certificate for the PHP API gateway
CERT_DIR="$REMOTE_DIR/certs"
CERT_FILE="$CERT_DIR/jetty.crt"

mkdir -p "$CERT_DIR"

echo "Exporting Jetty public certificate..."

keytool -exportcert \
    -alias jetty \
    -keystore "$KEYSTORE_PATH" \
    -storetype PKCS12 \
    -storepass "$JETTY_SSL_PASSWORD" \
    -rfc \
    -file "$CERT_FILE"

chmod 644 "$CERT_FILE"

echo "Certificate exported to: $CERT_FILE"

# Configure HTTPS connector
cat > "$JETTY_BASE/start.d/ssl.ini" <<EOF
--module=ssl
jetty.ssl.host=0.0.0.0
jetty.ssl.port=$JETTY_PORT
EOF

cat > "$JETTY_BASE/start.d/https.ini" <<EOF
--module=https
EOF

# Jetty 12.1 has a separate ssl-context module
if [ -f "$JETTY_BASE/start.d/ssl-context.ini" ]; then
    cat > "$JETTY_BASE/start.d/ssl-context.ini" <<EOF
--module=ssl-context
jetty.sslContext.keyStorePath=$JETTY_SSL_KEYSTORE
jetty.sslContext.keyStoreType=PKCS12
EOF
else
    # Jetty 12.0
    cat >> "$JETTY_BASE/start.d/ssl.ini" <<EOF
jetty.sslContext.keyStorePath=$JETTY_SSL_KEYSTORE
jetty.sslContext.keyStoreType=PKCS12
EOF
fi

# Ensure that no HTTP connector is enabled
if grep -R -nE '^[[:space:]]*--module=http([[:space:]]|$)' \
    "$JETTY_BASE/start.d" "$JETTY_BASE/start.ini" 2>/dev/null; then
    echo "HTTP module is still enabled. Check Jetty configuration."
    exit 1
fi

# Save environment variables for start.sh
umask 077

{
    printf 'JETTY_HOME=%q\n' "$JETTY_HOME"
    printf 'JETTY_BASE=%q\n' "$JETTY_BASE"
    printf 'JETTY_SSL_PASSWORD=%q\n' "$JETTY_SSL_PASSWORD"
} > "$REMOTE_DIR/jetty.env"

chmod 600 "$REMOTE_DIR/jetty.env"

cat > "$REMOTE_DIR/application.env" <<EOF
LABWORK_SERVICE_URL=${shellQuote(LABWORK_SERVICE_URL)}
EOF

echo "Jetty configuration completed."
`;

    runRemoteScript(remoteScript);
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
