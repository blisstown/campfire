// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-static';
import * as child_process from 'node:child_process';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
        adapter: adapter({
            pages: 'build',
            assets: 'build',
            fallback: "fallback.html",
            precompress: true,
            strict: true,
        }),
        version: {
            name: child_process.execSync('git rev-parse HEAD').toString().trim()
        },
        alias: {
            '@cf/ui/*': "./src/lib/ui",
            '@cf/icons/*': "./src/img/icons",
            '@cf/store/*': "./src/lib/stores"
        }
    },
};

export default config;

