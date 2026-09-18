import type { ConstructSerializerFactory } from '@art-js/constructs';

export type SerialisableNode = {
	construct: string;
	children?: unknown[];
	value?: unknown;
};

export type SerializerConfig = {
	constructs: ConstructSerializerFactory[];
};
