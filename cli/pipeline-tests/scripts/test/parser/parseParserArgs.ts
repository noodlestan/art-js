import { FIXTURES_DIR } from '../constants';
import { getFilterFixtureArg } from '../shared/getFilterFixtureArg';

import type { ParserCliArgs } from './types';

export function parseParserArgs(): ParserCliArgs {
	return {
		doWrite: process.argv.includes('--write'),
		doWriteDebug: process.argv.includes('--debug-write'),
		filterFixture: getFilterFixtureArg(),
		fixturesDir: FIXTURES_DIR,
	};
}
