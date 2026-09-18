import type { Node } from 'mdast';

import type { Construct } from '../factories';

export type ConstructSerializer = {
	readonly name: string;
	toMdast(node: Construct, children: Node[]): Node;
};

export type ConstructSerializerFactory = () => ConstructSerializer;
