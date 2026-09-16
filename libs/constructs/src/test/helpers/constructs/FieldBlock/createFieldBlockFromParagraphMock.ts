/**
 * @mocks createFieldBlockFromParagraph() from `@art-js/constructs`
 */

import { vi } from 'vitest';

export const createFieldBlockFromParagraphMock = (
	name: string = 'Test',
): {
	createFieldBlockFromParagraph: ReturnType<typeof vi.fn>;
} => ({
	createFieldBlockFromParagraph: vi.fn(() => ({
		construct: 'FieldBlock',
		name,
		children: [],
	})),
});
