import { describe, expect, it } from 'vitest';

import { makeNaturalExpressionFixture } from '../../../../../test/helpers';

import { trimFieldEdges } from './trimFieldEdges';

describe('trimFieldEdges', () => {
	it('WHEN the edge texts have surrounding whitespace trims them', () => {
		const expressions = [makeNaturalExpressionFixture({ value: '  hello  ' })];

		const result = trimFieldEdges(expressions);

		expect(result).toEqual([makeNaturalExpressionFixture({ value: 'hello' })]);
	});

	it('WHEN there are no text nodes leaves them untouched', () => {
		const expressions = [
			makeNaturalExpressionFixture({ type: 'inlineCode', value: 'a' }),
			makeNaturalExpressionFixture({ type: 'inlineCode', value: 'b' }),
		];

		const result = trimFieldEdges(expressions);

		expect(result).toEqual(expressions);
	});

	it('WHEN the first text is only whitespace removes it', () => {
		const expressions = [
			makeNaturalExpressionFixture({ value: '  ' }),
			makeNaturalExpressionFixture({ type: 'inlineCode', value: 'a' }),
		];

		const result = trimFieldEdges(expressions);

		expect(result).toEqual([makeNaturalExpressionFixture({ type: 'inlineCode', value: 'a' })]);
	});

	it('WHEN the last text is only whitespace removes it', () => {
		const expressions = [
			makeNaturalExpressionFixture({ type: 'inlineCode', value: 'a' }),
			makeNaturalExpressionFixture({ value: '  ' }),
		];

		const result = trimFieldEdges(expressions);

		expect(result).toEqual([makeNaturalExpressionFixture({ type: 'inlineCode', value: 'a' })]);
	});
});
