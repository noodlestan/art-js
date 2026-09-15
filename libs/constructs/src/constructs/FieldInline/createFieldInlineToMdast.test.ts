import { describe, expect, it } from 'vitest';

import { createFieldInlineToMdast } from './createFieldInlineToMdast';

describe('createFieldInlineToMdast', () => {
	it('converts a FieldInline to a paragraph with strong label', () => {
		const impl = createFieldInlineToMdast();
		const result = impl.toMdast(
			{ construct: 'FieldInline', name: 'Purpose', children: [] } as never,
			[],
		);
		expect(result).toEqual({
			type: 'paragraph',
			children: [
				{ type: 'strong', children: [{ type: 'text', value: 'Purpose:' }] },
				{ type: 'text', value: ' ' },
			],
		});
	});

	it('appends tags when present', () => {
		const impl = createFieldInlineToMdast();
		const result = impl.toMdast(
			{
				construct: 'FieldInline',
				name: 'Purpose',
				children: [],
				tags: [{ construct: 'Tag', name: 'test' }],
			} as never,
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
