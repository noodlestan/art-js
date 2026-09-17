/**
 * @mocks isFieldStrong() from `src/shared/fields/helpers`
 */

import { vi } from 'vitest';

export const isFieldStrongMock = (
	returnValue: boolean = true,
): {
	isFieldStrong: ReturnType<typeof vi.fn>;
} => ({
	isFieldStrong: vi.fn(() => returnValue),
});
