// Throws instead of returning a result: fixture tests let the error propagate
// so the runner can catch, report, and continue with the remaining cases.
export function assert(condition: unknown, message: string): asserts condition {
	if (!condition) throw new Error(message);
}
