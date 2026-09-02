import * as path from 'node:path';

const THIS_DIR = path.dirname(new URL(import.meta.url).pathname);
const DEFAULT_FIXTURES_DIR = path.resolve(
	THIS_DIR,
	'..',
	'..',
	'..',
	'..',
	'libs',
	'constructs',
	'test',
	'fixtures',
);

const pathArgIdx = process.argv.indexOf('--path');
const pathArg = pathArgIdx !== -1 ? process.argv[pathArgIdx + 1] : undefined;

export const FIXTURES_DIR = pathArg ? path.resolve(pathArg) : DEFAULT_FIXTURES_DIR;
