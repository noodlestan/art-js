import { describe, expect, it } from 'vitest';

import { makeFieldInline } from '../../test/helpers/fieldInline/makeFieldInline';
import { makeTag } from '../../test/helpers/tag/makeTag';

import { createFieldInlineToMdast } from './createFieldInlineToMdast';

describe('createFieldInlineToMdast', () => {
	it('converts a FieldInline to a paragraph with strong label', () => {
		const impl = createFieldInlineToMdast();
		const result = impl.toMdast(makeFieldInline({ name: 'Purpose' }) as never, []);
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
			makeFieldInline({ name: 'Purpose', tags: [makeTag()] }) as never,
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
