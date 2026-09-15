import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['src/**/*.test.ts'],
		passWithNoTests: true,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'text-summary'],
			exclude: ['src/index.ts'],
			thresholds: {
				lines: 25,
				functions: 40,
				branches: 0,
				statements: 25,
			},
		},
	},
});
