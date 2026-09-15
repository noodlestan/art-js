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
				lines: 85,
				functions: 75,
				branches: 65,
				statements: 80,
			},
		},
	},
});
