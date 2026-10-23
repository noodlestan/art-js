import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['fixtures/**/integration.test.ts'],
	},
});
