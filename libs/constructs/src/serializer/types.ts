import type { Node } from 'mdast';

import type { Construct } from '../constructs/types';

export type ConstructSerializer = {
	readonly name: string;
	toMdast(node: Construct, children: Node[]): Node;
};

export type ConstructSerializerFactory = () => ConstructSerializer;
