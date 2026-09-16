import { describe, expect, it } from 'vitest';

import { makeFieldInlineMock } from '../../test/helpers/constructs/FieldInline/makeFieldInlineMock';
import { makeTagMock } from '../../test/helpers/constructs/Tag/makeTagMock';

import { createFieldInlineToMdast } from './createFieldInlineToMdast';

describe('createFieldInlineToMdast', () => {
	it('converts a FieldInline to a paragraph with strong label', () => {
		const impl = createFieldInlineToMdast();
		const result = impl.toMdast(makeFieldInlineMock({ name: 'Purpose' }) as never, []);
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
