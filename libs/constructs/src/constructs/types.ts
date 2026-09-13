/* eslint-disable @typescript-eslint/no-explicit-any */

import type { MdastNode, ParserVisitContext } from '@art-js/primitives';
import type { Node } from 'mdast';

import type { Construct } from '../registry';

export interface ConstructCreator {
	detect(node: MdastNode, context: ParserVisitContext): boolean;
	create(node: MdastNode, context: ParserVisitContext): Construct | Construct[];
}

export interface ConstructPreProcessor {
	preProcess(node: MdastNode, context: ParserVisitContext): Construct | null;
}

export interface ConstructHandler {
	handle(record: Construct, node: MdastNode, context: ParserVisitContext): ParserVisitContext;
}

export interface ConstructParser {
	preProcessor?: ConstructPreProcessor;
	handler?: ConstructHandler;
	factory?: ConstructCreator;
}

export type ConstructParserFactory = () => ConstructParser;

export interface ConstructToMdast {
	construct: string;
	toMdast(node: Construct, children: Node[]): Node;
}

export type ConstructToMdastFactory = () => ConstructToMdast;
