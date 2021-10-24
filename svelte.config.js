import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		ssr: false, // seems to cause problems, disable for now
		vite: {
			server: {
				proxy: {
					'/v1': 'http://localhost:8080'
				}
			}
		}
	}
};

export default config;
