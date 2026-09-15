import { vi } from 'vitest';

export const makeNodePositionMock = (): {
	nodePosition: ReturnType<typeof vi.fn>;
} => ({
	nodePosition: vi.fn(() => ({
		start: { line: 1, column: 1, offset: 0 },
		end: { line: 1, column: 1, offset: 0 },
	})),
});
