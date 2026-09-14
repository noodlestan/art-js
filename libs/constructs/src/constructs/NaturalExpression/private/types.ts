import type { ContainerConstructBase } from '@art-js/primitives';

export interface NaturalExpression extends ContainerConstructBase {
	construct: 'NaturalExpression';
	type: string;
	attributes?: Record<string, unknown>;
	value?: string;
	children: NaturalExpression[];
}
