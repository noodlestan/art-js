/**
 * @fixture NaturalExpression of factory`libs/constructs/src/constructs/NaturalExpression/private/factory/createNaturalExpression.ts`
 */

import type { NaturalExpression } from '../../../../factories';

export const makeNaturalExpressionMock = (options?: {
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
