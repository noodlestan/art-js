/**
 * @mocks createFieldBlock() from `@art-js/constructs`
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
