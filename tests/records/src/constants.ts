import type { FSRecordsPattern } from '@art-lib/fs-records';

export const RUN_TEST_FILENAME = 'run-test.ts';

export const recordsPatterns: FSRecordsPattern[] = [
	{
		base: '.',
		pattern: '**/_records/**/*.art',
		ignored: ['node_modules/', '.git/', 'dist/'],
		excluded: [],
		gitignore: true,
	},
];
