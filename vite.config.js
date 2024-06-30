import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import svg from '@poppanator/sveltekit-svg'

const packageFile = fileURLToPath(new URL('package.json', import.meta.url));
const packageData = readFileSync(packageFile, 'utf8');
const packageJSON = JSON.parse(packageData);


export default defineConfig({
	plugins: [
        sveltekit(),
        svg()
    ],
    define: {
        APP_VERSION: JSON.stringify(packageJSON.version)
    }
});

