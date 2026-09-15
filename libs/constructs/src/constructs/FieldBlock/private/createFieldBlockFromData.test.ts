import { describe, expect, it } from 'vitest';

import { makeFieldBlock } from '../../../test/helpers/fieldBlock/makeFieldBlock';
import { makeNaturalBlock } from '../../../test/helpers/naturalBlock/makeNaturalBlock';
import { makeTag } from '../../../test/helpers/tag/makeTag';

import { createFieldBlockFromData } from './createFieldBlockFromData';

describe('createFieldBlockFromData', () => {
	it('creates a FieldBlock from minimal data', () => {
		const result = createFieldBlockFromData({ name: 'Test' });
		expect(result).toEqual(makeFieldBlock());
	});

	it('includes children and tags when provided', () => {
		const result = createFieldBlockFromData({
			name: 'Test',
			children: [makeNaturalBlock()],
			tags: [makeTag()],
		});
		expect(result.children).toHaveLength(1);
		expect(result.tags).toHaveLength(1);
	});
});
