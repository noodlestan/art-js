/**
 * @mocks createFieldBlock() from `src/constructs/FieldBlock/private/factory`
 */

import { vi } from 'vitest';

export const createFieldBlockMock = (
	name: string = 'Test',
): {
	createFieldBlock: ReturnType<typeof vi.fn>;
} => ({
	createFieldBlock: vi.fn(() => ({
		construct: 'FieldBlock',
		name,
		children: [],
	})),
});
