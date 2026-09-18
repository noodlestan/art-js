/**
 * @mocks createFieldInline() from `@art-js/constructs`
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
