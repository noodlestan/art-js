import { vi } from 'vitest';

export const makeIsFieldStrongMock = (
	returnValue: boolean = true,
): {
	isFieldStrong: ReturnType<typeof vi.fn>;
} => ({
	isFieldStrong: vi.fn(() => returnValue),
});
