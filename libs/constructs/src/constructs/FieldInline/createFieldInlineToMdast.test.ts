import { describe, expect, it } from 'vitest';

import { makeFieldInlineMock, makeTagMock } from '../../test/helpers';

import { createFieldInlineToMdast } from './createFieldInlineToMdast';

describe('createFieldInlineToMdast', () => {
	it('WHEN converting a FieldInline to a paragraph with strong label', () => {
		const toMdast = createFieldInlineToMdast();

		const result = toMdast.toMdast(makeFieldInlineMock({ name: 'Purpose' }) as never, []);

		expect(result).toEqual({
			type: 'paragraph',
			children: [
				{ type: 'strong', children: [{ type: 'text', value: 'Purpose:' }] },
				{ type: 'text', value: ' ' },
			],
		});
	});

	it('WHEN present appends tags', () => {
		const toMdast = createFieldInlineToMdast();

		const result = toMdast.toMdast(
			makeFieldInlineMock({ name: 'Purpose', tags: [makeTagMock()] }) as never,
			[],
		);
		expect(result).toEqual({
			type: 'paragraph',
			children: [
				{ type: 'strong', children: [{ type: 'text', value: 'Purpose:' }] },
				{ type: 'text', value: ' ' },
				{ type: 'text', value: ' (#test)' },
			],
		});
	});
});
