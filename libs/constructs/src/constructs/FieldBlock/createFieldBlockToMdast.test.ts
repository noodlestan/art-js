import type { Text } from 'mdast';
import { describe, expect, it } from 'vitest';

import { makeFieldBlockMock, makeTagMock } from '../../test/helpers';

import { createFieldBlockToMdast } from './createFieldBlockToMdast';

describe('createFieldBlockToMdast', () => {
	it('WHEN converting a FieldBlock to a label paragraph', () => {
		const impl = createFieldBlockToMdast();
		const value: Text = { type: 'text', value: ' Generate and manage agent instructions.' };

		const result = impl.toMdast(makeFieldBlockMock({ name: 'Purpose' }) as never, [value]);

		expect(result).toEqual({
			type: 'paragraph',
			children: [{ type: 'strong', children: [{ type: 'text', value: 'Purpose:' }] }],
		});
	});

	it('WHEN present includes tags', () => {
		const impl = createFieldBlockToMdast();

		const result = impl.toMdast(
			makeFieldBlockMock({ name: 'Purpose', tags: [makeTagMock()] }) as never,
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
