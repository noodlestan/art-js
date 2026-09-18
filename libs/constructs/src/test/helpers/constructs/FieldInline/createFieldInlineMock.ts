/**
 * @mocks createFieldInline() from `src/constructs/FieldInline/private/factory`
 */

import { vi } from 'vitest';

export const createFieldInlineMock = (
	name: string = 'Test',
): {
	createFieldInline: ReturnType<typeof vi.fn>;
} => ({
	createFieldInline: vi.fn(() => ({
		construct: 'FieldInline',
		name,
		children: [],
	})),
});
