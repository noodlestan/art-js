/* eslint-disable @typescript-eslint/no-explicit-any */

import type { ConstructBase, MdastNode, ParserVisitContext } from '@art-js/primitives';
import type { Node } from 'mdast';

import type { Construct } from '../types';

export type ConstructProcessor = {
	captureNode(context: ParserVisitContext, node: MdastNode): Construct | null;
};

export type ConstructIntegrator = {
	integrate(context: ParserVisitContext, node: MdastNode, construct: Construct): ParserVisitContext;
};

export type ConstructFactory<T extends ConstructBase> = {
	fromData(data: unknown): T;
};

export type ConstructParser<T extends ConstructBase = ConstructBase> = {
	readonly name: string;
	processor?: ConstructProcessor;
	integrator?: ConstructIntegrator;
	factory: ConstructFactory<T>;
};

export type ConstructParserFactory<T extends ConstructBase = ConstructBase> =
	() => ConstructParser<T>;

export type ConstructSerializer = {
	readonly name: string;
	toMdast(node: Construct, children: Node[]): Node;
};

export type ConstructSerializerFactory = () => ConstructSerializer;
