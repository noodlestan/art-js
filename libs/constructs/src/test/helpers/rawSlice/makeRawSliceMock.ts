import { vi } from 'vitest';

export const makeRawSliceMock = (
	returnValue: string = '',
): { rawSlice: ReturnType<typeof vi.fn> } => ({
	rawSlice: vi.fn(() => returnValue),
});
