/**
 * @mocks createNaturalBlockFromNode() from `src/constructs/NaturalBlock/private/helpers`
 */

import { vi } from 'vitest';

export const createNaturalBlockFromNodeMock = (
	value: string = 'hello',
): {
	createNaturalBlockFromNode: ReturnType<typeof vi.fn>;
} => ({
	createNaturalBlockFromNode: vi.fn(() => ({
		construct: 'NaturalBlock',
		value,
		children: [],
	})),
});
