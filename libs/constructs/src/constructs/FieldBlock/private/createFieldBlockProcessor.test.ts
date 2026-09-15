import { describe, expect, it, vi } from 'vitest';

vi.mock('../../../helpers/rawSlice', () => ({
	rawSlice: vi.fn(() => ''),
}));

vi.mock('../../Tag/private/extractTags', () => ({
	extractTags: vi.fn(() => ({ tags: [], stripped: '' })),
}));

vi.mock('./createFieldBlockFromParagraph', () => ({
	createFieldBlockFromParagraph: vi.fn(() => ({
		construct: 'FieldBlock',
		name: 'Test',
		children: [],
	})),
}));

vi.mock('./isFieldStrong', () => ({
	isFieldStrong: vi.fn(() => true),
}));

describe('createFieldBlockProcessor', () => {
	it('returns a processor', async () => {
		const { createFieldBlockProcessor } = await import('./createFieldBlockProcessor');
		const processor = createFieldBlockProcessor();
		expect(processor.captureNode).toBeInstanceOf(Function);
	});
});
