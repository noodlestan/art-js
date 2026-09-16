/**
 * @mocks rawSlice() from `@art-js/constructs`
 */

import { vi } from 'vitest';

export const rawSliceMock = (returnValue: string = ''): { rawSlice: ReturnType<typeof vi.fn> } => ({
	rawSlice: vi.fn(() => returnValue),
});
