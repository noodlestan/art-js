import { makeParserVisitContextMock } from '@art-js/primitives/src/test/helpers';
import { describe, expect, it, vi } from 'vitest';

import { createNaturalBlockFromNodeMock } from '../../../../../test/helpers';
import { createNaturalBlockFromNode } from '../helpers/createNaturalBlockFromNode';

import { createNaturalBlockProcessor } from './createNaturalBlockProcessor';

vi.mock('../helpers/createNaturalBlockFromNode', async () => {
	return createNaturalBlockFromNodeMock();
});

describe('createNaturalBlockProcessor', () => {
	it('WHEN capturing a node returns the createNaturalBlockFromNode result', () => {
		const processor = createNaturalBlockProcessor();
		const context = makeParserVisitContextMock();
		const node = { type: 'paragraph', children: [] };

		const result = processor.captureNode(context, node);

		expect(createNaturalBlockFromNode).toHaveBeenCalledWith(node, context);
		expect(result).toBe(vi.mocked(createNaturalBlockFromNode).mock.results[0]?.value);
	});
});
