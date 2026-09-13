import type {
	BlockContent,
	DefinitionContent,
	ListContent,
	Node,
	PhrasingContent,
	RootContent,
	RowContent,
	TableContent,
} from 'mdast';

import type { ConstructBase } from '../constructs.js';
import type { Point } from '../point.js';

type ChildNode =
	| RootContent
	| BlockContent
	| PhrasingContent
	| ListContent
	| DefinitionContent
	| TableContent
	| RowContent;

export type MdastNode = Node & {
	children?: ChildNode[];
	value?: string;
};

export type BeforeRecord = (
	record: ConstructBase,
	context: ParserVisitContext,
) => ParserVisitContext;

export interface ParserVisitContext {
	readonly construct: ConstructBase;
	push(record: ConstructBase): void;
	target(): ConstructBase[];
	beforeRecord(record: ConstructBase): ParserVisitContext;
	parent(): ParserVisitContext | undefined;
	markdown: string;
	lastEnd: Point | undefined;
}
