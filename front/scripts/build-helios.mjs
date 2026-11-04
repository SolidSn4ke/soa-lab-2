import { spawnSync } from 'node:child_process';

process.loadEnvFile('.env');

const baseHref = process.env.BASE_HREF;

if (!baseHref) {
    console.error('BASE_HREF is not defined in .env');
    process.exit(1);
}

if (!baseHref.startsWith('/') || !baseHref.endsWith('/')) {
    console.error('BASE_HREF must start and end with "/"');
    process.exit(1);
}

const result = spawnSync(
    'npx',
    [
        'ng',
        'build',
        '--configuration',
        'production,helios',
        '--base-href',
        baseHref
    ],
    { stdio: 'inherit', shell: process.platform === 'win32' }
);

process.exit(result.status ?? 1);