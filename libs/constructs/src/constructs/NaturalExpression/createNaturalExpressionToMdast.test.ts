import { describe, expect, it } from 'vitest';

import { makeNaturalExpression } from '../../test/helpers/naturalExpression/makeNaturalExpression';

import { createNaturalExpressionToMdast } from './createNaturalExpressionToMdast';

describe('createNaturalExpressionToMdast', () => {
	it('converts a NaturalExpression to an mdast node', () => {
		const impl = createNaturalExpressionToMdast();
		const result = impl.toMdast(makeNaturalExpression() as never, []);
		expect(result).toEqual({ type: 'text', value: 'hello', children: [] });
	});

	it('preserves attributes in the mdast node', () => {
		const impl = createNaturalExpressionToMdast();
		const result = impl.toMdast(
			makeNaturalExpression({
				type: 'inlineCode',
				value: 'code',
				attributes: { lang: 'ts' },
			}) as never,
			[],
		);
		expect(result).toEqual({ type: 'inlineCode', value: 'code', lang: 'ts', children: [] });
	});
});
