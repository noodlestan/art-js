import type { Text } from 'mdast';
import { describe, expect, it } from 'vitest';

import { makeFieldBlock } from '../../test/helpers/fieldBlock/makeFieldBlock';
import { makeTag } from '../../test/helpers/tag/makeTag';

import { createFieldBlockToMdast } from './createFieldBlockToMdast';

describe('createFieldBlockToMdast', () => {
	it('converts a FieldBlock to a label paragraph', () => {
		const impl = createFieldBlockToMdast();
		const value: Text = { type: 'text', value: ' Generate and manage agent instructions.' };
		const result = impl.toMdast(makeFieldBlock({ name: 'Purpose' }) as never, [value]);
		expect(result).toEqual({
			type: 'paragraph',
			children: [{ type: 'strong', children: [{ type: 'text', value: 'Purpose:' }] }],
		});
	});

	it('includes tags when present', () => {
		const impl = createFieldBlockToMdast();
		const result = impl.toMdast(
			makeFieldBlock({ name: 'Purpose', tags: [makeTag()] }) as never,
			[],
		);
		expect(result).toEqual({
			type: 'paragraph',
			children: [
				{ type: 'strong', children: [{ type: 'text', value: 'Purpose:' }] },
				{ type: 'text', value: ' (#test)' },
			],
		});
	});
});
