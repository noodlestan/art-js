import type { FixtureTestOutcome } from '../../types.js';

export function createFixtureOutcome(
	caseName: string,
	startedAt: number,
	status: 'PASS' | 'FAIL',
	error?: string,
): FixtureTestOutcome {
	const durationMs = Date.now() - startedAt;

	const outcome: FixtureTestOutcome = {
		caseName,
		status,
		durationMs,
		error,
	};

	return outcome;
}
