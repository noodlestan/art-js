export interface SerializerCliArgs {
	doWriteDebug: boolean;
	filterFixture: string | undefined;
	fixturesDir: string;
}

export interface SerializeResult {
	durationMs: number;
	success: boolean;
	error?: string;
}
