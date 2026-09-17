import type { ContainerConstructBase } from '@art-js/primitives';

export type NaturalExpression = ContainerConstructBase & {
	construct: 'NaturalExpression';
	type: string;
	attributes?: Record<string, unknown>;
	value?: string;
	children: NaturalExpression[];
};
