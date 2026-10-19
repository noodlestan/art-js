import type { FixtureTestReport } from './types.js';

export function printFixtureTestReport(report: FixtureTestReport): void {
	console.info(`Discovered ${report.discovered} fixture test director(ies).`);
	if (report.skippedCases.length > 0) {
		console.info(
			`Skipped ${report.skippedCases.length} case(s) prefixed with "_": ${report.skippedCases.join(', ')}.`,
		);
	}
	console.info('');

	const width = Math.max(6, ...report.outcomes.map(outcome => `${outcome.durationMs}ms`.length));
	for (const outcome of report.outcomes) {
		const duration = `${outcome.durationMs}ms`.padEnd(width);
		console.info(`${outcome.status.padEnd(4)} ${duration} ${outcome.caseName}`);
		if (outcome.error !== undefined) {
			console.error(`         ERROR in case "${outcome.caseName}": ${outcome.error}`);
		}
	}

	console.info('');
	console.info('='.repeat(56));
	console.info(`Results:    ${report.tested} test(s) run`);
	console.info(`Passed:     ${report.passed}`);
	console.info(`Failed:     ${report.failed}`);
	console.info(`Skipped:    ${report.skippedCases.length}`);
	console.info(`Total time: ${report.totalTimeMs}ms`);
	console.info('='.repeat(56));

	if (report.failed > 0) {
		console.error(`\n${report.failed} test(s) failed`);
	}
}
