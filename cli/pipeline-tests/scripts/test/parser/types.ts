export interface ParserCliArgs {
	doWrite: boolean;
	doWriteDebug: boolean;
	filterFixture: string | undefined;
	fixturesDir: string;
}

export interface ParseResult {
	success: boolean;
	document?: unknown;
	error?: string;
	durationMs: number;
}
