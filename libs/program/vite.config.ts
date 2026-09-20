import { readFileSync } from 'fs';
import { resolve } from 'path';

import { defineConfig } from 'vite';

const NAME = JSON.parse(readFileSync('package.json', 'utf8')).name;

export default defineConfig({
	plugins: [],
	resolve: {
		alias: [],
	},
	server: {
		port: 3000,
	},
	build: {
		outDir: 'dist/esm/',
		emptyOutDir: true,
		target: 'esnext',
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: NAME,
			fileName: 'index',
			formats: ['es'],
		},
		rollupOptions: {
			tsconfig: './tsconfig.vite.json',
			external: ['solid-js'],
		},
	},
});
