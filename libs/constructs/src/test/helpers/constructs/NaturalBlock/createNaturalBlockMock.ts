/**
 * @mocks createNaturalBlock() from `src/constructs/NaturalBlock/private/factory`
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
