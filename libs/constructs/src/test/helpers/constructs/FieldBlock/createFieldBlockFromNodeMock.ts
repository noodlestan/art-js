/**
 * @mocks createFieldBlockFromNode() from `src/constructs/FieldBlock/private/helpers`
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
