import { nodePositionMock } from '@art-js/primitives/src/test/helpers';
import { describe, expect, it, vi } from 'vitest';

import { makeTagMock, stripStrongMock } from '../../../../test/helpers';

import { createFieldBlockFromNode } from './createFieldBlockFromNode';

vi.mock('@art-js/primitives', () => {
	return nodePositionMock();
});

vi.mock('../../../../shared/fields', () => {
	return stripStrongMock('Purpose:');
});

describe('createFieldBlockFromNode', () => {
	it('WHEN creating a FieldBlock from a paragraph', async () => {
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

		const result = createFieldBlockFromNode(paragraph as never, context);

		expect(result.construct).toBe('FieldBlock');
		expect(result.name).toBe('Purpose');
	});

	it('WHEN provided includes tags', async () => {
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

		const result = createFieldBlockFromNode(paragraph as never, context, [makeTagMock()]);

		expect(result.tags).toHaveLength(1);
	});
});
