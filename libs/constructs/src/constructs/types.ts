/* eslint-disable @typescript-eslint/no-explicit-any */

import type { MdastNode, ParserVisitContext } from '@art-js/primitives';
import type { Node } from 'mdast';

import type { Construct } from '../registry';

export interface ConstructCreator {
	detect(node: MdastNode, context: ParserVisitContext): boolean;
	create(node: MdastNode, context: ParserVisitContext): Construct | Construct[];
}

export interface ConstructProcessor {
	captureNode(context: ParserVisitContext, node: MdastNode): Construct | null;
}

export interface ConstructHandler {
	handle(construct: Construct, node: MdastNode, context: ParserVisitContext): ParserVisitContext;
}

export interface ConstructParser {
	processor?: ConstructProcessor;
	handler?: ConstructHandler;
	factory?: ConstructCreator;
}

export type ConstructParserFactory = () => ConstructParser;

export interface ConstructSerializer {
	readonly name: string;
	toMdast(node: Construct, children: Node[]): Node;
}

export type ConstructSerializerFactory = () => ConstructSerializer;
