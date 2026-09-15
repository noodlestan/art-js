import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['src/**/*.test.ts'],
		passWithNoTests: true,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'text-summary'],
			exclude: ['src/index.ts', 'src/test/**'],
			thresholds: {
				lines: 95,
				functions: 100,
				branches: 93,
				statements: 95,
			},
		},
	},
});
