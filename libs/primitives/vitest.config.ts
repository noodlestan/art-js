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
				lines: 80,
				functions: 80,
				branches: 50,
				statements: 80,
			},
		},
	},
});
