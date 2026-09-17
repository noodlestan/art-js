import { describe, expect, it } from 'vitest';

import { makeNaturalExpressionMock } from '../../test/helpers';

import { createNaturalExpressionToMdast } from './createNaturalExpressionToMdast';

describe('createNaturalExpressionToMdast', () => {
	it('WHEN converting a NaturalExpression to an mdast node', () => {
		const impl = createNaturalExpressionToMdast();

		const result = impl.toMdast(makeNaturalExpressionMock() as never, []);

		expect(result).toEqual({ type: 'text', value: 'hello', children: [] });
	});

	it('WHEN converting preserves attributes in the mdast node', () => {
		const impl = createNaturalExpressionToMdast();

		const result = impl.toMdast(
			makeNaturalExpressionMock({
				type: 'inlineCode',
				value: 'code',
				attributes: { lang: 'ts' },
			}) as never,
			[],
		);
		expect(result).toEqual({ type: 'inlineCode', value: 'code', lang: 'ts', children: [] });
	});
});
