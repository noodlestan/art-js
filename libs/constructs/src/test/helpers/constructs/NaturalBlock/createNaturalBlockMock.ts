/**
 * @mocks createNaturalBlock() from `@art-js/constructs`
 */

import { vi } from 'vitest';

export const createNaturalBlockMock = (
	value: string = 'hello',
): {
	createNaturalBlock: ReturnType<typeof vi.fn>;
} => ({
	createNaturalBlock: vi.fn(() => ({
		construct: 'NaturalBlock',
		value,
		children: [],
	})),
});
