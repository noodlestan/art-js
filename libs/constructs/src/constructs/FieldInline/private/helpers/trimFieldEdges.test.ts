import { describe, expect, it } from 'vitest';

import { makeNaturalExpressionMock } from '../../../../test/helpers';

import { trimFieldEdges } from './trimFieldEdges';

describe('trimFieldEdges', () => {
	it('WHEN the edge texts have surrounding whitespace trims them', () => {
		const expressions = [makeNaturalExpressionMock({ value: '  hello  ' })];

		const result = trimFieldEdges(expressions);

		expect(result).toEqual([makeNaturalExpressionMock({ value: 'hello' })]);
	});

	it('WHEN there are no text nodes leaves them untouched', () => {
		const expressions = [
			makeNaturalExpressionMock({ type: 'inlineCode', value: 'a' }),
			makeNaturalExpressionMock({ type: 'inlineCode', value: 'b' }),
		];

		const result = trimFieldEdges(expressions);

		expect(result).toEqual(expressions);
	});

	it('WHEN the first text is only whitespace removes it', () => {
		const expressions = [
			makeNaturalExpressionMock({ value: '  ' }),
			makeNaturalExpressionMock({ type: 'inlineCode', value: 'a' }),
		];

		const result = trimFieldEdges(expressions);

		expect(result).toEqual([makeNaturalExpressionMock({ type: 'inlineCode', value: 'a' })]);
	});

	it('WHEN the last text is only whitespace removes it', () => {
		const expressions = [
			makeNaturalExpressionMock({ type: 'inlineCode', value: 'a' }),
			makeNaturalExpressionMock({ value: '  ' }),
		];

		const result = trimFieldEdges(expressions);

		expect(result).toEqual([makeNaturalExpressionMock({ type: 'inlineCode', value: 'a' })]);
	});
});
