import { vi } from 'vitest';

export const makeStripStrongMock = (
	returnValue: string = '',
): { stripStrong: ReturnType<typeof vi.fn> } => ({
	stripStrong: vi.fn(() => returnValue),
});
