/**
 * @mocks createFieldInlineFromNode() from `@art-js/constructs`
 */

import { vi } from 'vitest';

export const createFieldInlineFromNodeMock = (
	name: string = 'Test',
): {
	createFieldInlineFromNode: ReturnType<typeof vi.fn>;
} => ({
	createFieldInlineFromNode: vi.fn(() => ({
		construct: 'FieldInline',
		name,
		children: [],
	})),
});
