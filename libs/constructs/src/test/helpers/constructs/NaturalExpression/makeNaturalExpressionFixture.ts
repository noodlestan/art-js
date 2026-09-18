/**
 * @fixture NaturalExpression of factory`libs/constructs/src/constructs/NaturalExpression/factory/createNaturalExpression.ts`
 */

import type { NaturalExpression } from '../../../../constructs';

export const makeNaturalExpressionFixture = (options?: {
	type?: string;
	value?: string;
	attributes?: Record<string, unknown>;
	children?: NaturalExpression['children'];
}): NaturalExpression => ({
	construct: 'NaturalExpression',
	type: options?.type ?? 'text',
	value: options?.value ?? 'hello',
	children: options?.children ?? [],
	...(options?.attributes !== undefined ? { attributes: options.attributes } : {}),
});
