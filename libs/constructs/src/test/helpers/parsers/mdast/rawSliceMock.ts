/**
 * @mocks rawSlice() from `src/parsers/mdast`
 */

import { vi } from 'vitest';

export const rawSliceMock = (returnValue: string = ''): { rawSlice: ReturnType<typeof vi.fn> } => ({
	rawSlice: vi.fn(() => returnValue),
});
