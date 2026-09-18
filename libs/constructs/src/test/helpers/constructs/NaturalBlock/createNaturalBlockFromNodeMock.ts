/**
 * @mocks createNaturalBlockFromNode() from `@art-js/constructs`
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
