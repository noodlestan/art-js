export type RecordsPattern = {
	base: string;
	pattern: string | string[];
	ignored: string[];
	excluded: string[];
	gitignore: boolean;
};

export const RUN_TEST_FILENAME = 'run-test.ts';

export const recordsPatterns: RecordsPattern[] = [
	{
		base: '.',
		pattern: '**/_records/**/*.art',
		ignored: ['node_modules/', '.git/', 'dist/'],
		excluded: [],
		gitignore: true,
	},
];
