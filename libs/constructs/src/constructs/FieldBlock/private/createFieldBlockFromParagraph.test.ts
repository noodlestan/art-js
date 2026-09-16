import { describe, expect, it, vi } from 'vitest';

import { makeTagMock } from '../../../test/helpers/constructs/Tag/makeTagMock';

vi.mock('@art-js/primitives', async () => {
	const { nodePositionMock } =
		await import('@art-js/primitives/src/test/helpers/primitives/nodePositionMock');
	return nodePositionMock();
});

vi.mock('./stripStrong', async () => {
	const { stripStrongMock } =
		await import('../../../test/helpers/constructs/FieldBlock/stripStrongMock');
	return stripStrongMock('Purpose:');
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
		const result = createFieldBlockFromParagraph(paragraph as never, context, [makeTagMock()]);
		expect(result.tags).toHaveLength(1);
	});
});
