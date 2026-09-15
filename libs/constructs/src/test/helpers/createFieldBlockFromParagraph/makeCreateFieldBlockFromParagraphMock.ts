import { vi } from 'vitest';

export const makeCreateFieldBlockFromParagraphMock = (
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
