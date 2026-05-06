import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

const hasArtisan = existsSync('artisan');
const hasVendorAutoload = existsSync('vendor/autoload.php');

const hasMbSplit = (() => {
    try {
        execSync('php -r "exit(function_exists(\'mb_split\') ? 0 : 1);"', {
            stdio: 'ignore',
        });
        return true;
    } catch {
        return false;
    }
})();

const shouldRunWayfinder =
    process.env.VITE_WAYFINDER !== 'false' &&
    hasArtisan &&
    hasVendorAutoload &&
    hasMbSplit;

if (!shouldRunWayfinder) {
    console.warn(
        '[vite] Wayfinder generation disabled (missing artisan/vendor autoload, PHP, or mbstring extension).',
    );
}

export default defineConfig({
    server: {
        host: '127.0.0.1',
        port: 5173,
        strictPort: true,
        hmr: {
            host: '127.0.0.1',
        },
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            // ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        ...(shouldRunWayfinder
            ? [
                  wayfinder({
                      formVariants: true,
                  }),
              ]
            : []),
    ],
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
    esbuild: {
        jsx: 'automatic',
    },
});
