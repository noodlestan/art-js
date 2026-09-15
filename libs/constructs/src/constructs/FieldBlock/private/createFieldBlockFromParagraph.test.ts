import { describe, expect, it, vi } from 'vitest';

vi.mock('@art-js/primitives', () => ({
	nodePosition: vi.fn(() => ({
		start: { line: 1, column: 1, offset: 0 },
		end: { line: 1, column: 1, offset: 0 },
	})),
}));

vi.mock('./stripStrong', () => ({
	stripStrong: vi.fn(() => 'Purpose:'),
}));

describe('createFieldBlockFromParagraph', () => {
	it('creates a FieldBlock from a paragraph', async () => {
		const { createFieldBlockFromParagraph } = await import('./createFieldBlockFromParagraph');
		const paragraph = {
			type: 'paragraph',
			children: [
				{
					type: 'strong',
					children: [{ type: 'text', value: 'Purpose:' }],
				},
			],
		};
		const context = { markdown: '' } as never;
		const result = createFieldBlockFromParagraph(paragraph as never, context);
		expect(result.construct).toBe('FieldBlock');
		expect(result.name).toBe('Purpose');
	});

	it('includes tags when provided', async () => {
		const { createFieldBlockFromParagraph } = await import('./createFieldBlockFromParagraph');
		const paragraph = {
			type: 'paragraph',
			children: [
				{
					type: 'strong',
					children: [{ type: 'text', value: 'Purpose:' }],
				},
			],
		};
		const context = { markdown: '' } as never;
		const result = createFieldBlockFromParagraph(paragraph as never, context, [
			{ construct: 'Tag', name: 'test' },
		]);
		expect(result.tags).toHaveLength(1);
	});
});
