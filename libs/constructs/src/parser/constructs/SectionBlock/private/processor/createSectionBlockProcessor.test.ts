import { makeParserVisitContextMock } from '@art-js/primitives/src/test/helpers';
import { describe, expect, it, vi } from 'vitest';

import { createSectionBlockFromNodeMock } from '../../../../../test/helpers';
import { createSectionBlockFromNode } from '../helpers/createSectionBlockFromNode';

import { createSectionBlockProcessor } from './createSectionBlockProcessor';

vi.mock('../helpers/createSectionBlockFromNode', async () => {
	return createSectionBlockFromNodeMock();
});

describe('createSectionBlockProcessor', () => {
	it('FOR non-heading nodes returns null', () => {
		const processor = createSectionBlockProcessor();
		const context = makeParserVisitContextMock();
		const node = { type: 'paragraph', children: [] };

		const result = processor.captureNode(context, node);

		expect(result).toBeNull();
	});

	it('WHEN capturing a heading returns the createSectionBlockFromNode result', () => {
		const processor = createSectionBlockProcessor();
		const context = makeParserVisitContextMock();
		const node = { type: 'heading', children: [] };

		const result = processor.captureNode(context, node);

		expect(createSectionBlockFromNode).toHaveBeenCalledWith(node, context);
		expect(result).toBe(vi.mocked(createSectionBlockFromNode).mock.results[0]?.value);
	});
});
