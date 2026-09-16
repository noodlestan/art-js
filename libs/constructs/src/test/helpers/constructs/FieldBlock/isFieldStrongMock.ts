/**
 * @mocks isFieldStrong() from `@art-js/constructs`
 */

import { vi } from 'vitest';

export const isFieldStrongMock = (
	returnValue: boolean = true,
): {
	isFieldStrong: ReturnType<typeof vi.fn>;
} => ({
	isFieldStrong: vi.fn(() => returnValue),
});
