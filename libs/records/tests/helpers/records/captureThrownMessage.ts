export function captureThrownMessage(run: () => void): string | undefined {
	try {
		run();
	} catch (error) {
		if (error instanceof Error) {
			return error.message;
		}
		return String(error);
	}

	return undefined;
}
