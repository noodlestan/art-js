import type { NaturalExpression } from '../types';

export type NaturalExpressionFactoryData = {
	type: string;
	value?: string;
	attributes?: Record<string, unknown>;
	children?: NaturalExpression[];
};
