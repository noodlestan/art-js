/**
 * @mocks stripStrong()  from `src/parsers/fields`
 */

import { vi } from 'vitest';

export const stripStrongMock = (
	returnValue: string = '',
): { stripStrong: ReturnType<typeof vi.fn> } => ({
	stripStrong: vi.fn(() => returnValue),
});
