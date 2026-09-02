import { FIXTURES_DIR } from '../constants';
import { getFilterFixtureArg } from '../shared/getFilterFixtureArg';

import type { SerializerCliArgs } from './types';

export function parseSerializerArgs(): SerializerCliArgs {
	return {
		doWriteDebug: process.argv.includes('--debug-write'),
		filterFixture: getFilterFixtureArg(),
		fixturesDir: FIXTURES_DIR,
	};
}
