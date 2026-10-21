// The contract every fixture test file implements: exercise one design use
// case, assert, and throw on failure. The runner owns the try/catch.
export type RunTest = () => Promise<void>;

export type FixtureTestOutcome = {
	readonly caseName: string;
	readonly status: 'PASS' | 'FAIL';
	readonly durationMs: number;
	readonly error?: string;
};

export type FixtureTestReport = {
	readonly discovered: number;
	// Case directory names prefixed with `_`: known failures kept out of the run.
	readonly skippedCases: readonly string[];
	readonly tested: number;
	readonly passed: number;
	readonly failed: number;
	readonly totalTimeMs: number;
	readonly outcomes: readonly FixtureTestOutcome[];
};

export type RunFixtureTestsOptions = {
	readonly fixturesDirectory: string;
	readonly filter?: string;
};
