import { describe, expect, it, vi } from 'vitest';

vi.mock('@art-js/primitives', async () => {
	const { makeNodePositionMock } =
		await import('../../../test/helpers/primitives/makeNodePositionMock');
	return makeNodePositionMock();
});

vi.mock('./stripStrong', async () => {
	const { makeStripStrongMock } =
		await import('../../../test/helpers/stripStrong/makeStripStrongMock');
	return makeStripStrongMock('Purpose:');
});

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
