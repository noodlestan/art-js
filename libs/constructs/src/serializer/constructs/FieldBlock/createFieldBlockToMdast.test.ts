import type { Text } from 'mdast';
import { describe, expect, it } from 'vitest';

import { makeFieldBlockFixture, makeTagFixture } from '../../../test/helpers';

import { createFieldBlockToMdast } from './createFieldBlockToMdast';

describe('createFieldBlockToMdast', () => {
	it('WHEN converting a FieldBlock to a label paragraph', () => {
		const toMdast = createFieldBlockToMdast();
		const value: Text = { type: 'text', value: ' Generate and manage agent instructions.' };

		const result = toMdast.toMdast(makeFieldBlockFixture({ name: 'Purpose' }) as never, [value]);

		expect(result).toEqual({
			type: 'paragraph',
			children: [{ type: 'strong', children: [{ type: 'text', value: 'Purpose:' }] }],
		});
	});

	it('WHEN present includes tags', () => {
		const toMdast = createFieldBlockToMdast();

		const result = toMdast.toMdast(
			makeFieldBlockFixture({ name: 'Purpose', tags: [makeTagFixture()] }) as never,
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
