/**
 * @mocks createFieldBlockFromNode() from `@art-js/constructs`
 */

import { vi } from 'vitest';

export const createFieldBlockFromNodeMock = (
	name: string = 'Test',
): {
	createFieldBlockFromNode: ReturnType<typeof vi.fn>;
} => ({
	createFieldBlockFromNode: vi.fn(() => ({
		construct: 'FieldBlock',
		name,
		children: [],
	})),
});
