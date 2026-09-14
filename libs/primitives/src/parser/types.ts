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

import type { ConstructBase } from '../constructs';

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

export type OnBeforeConstruct = (
	construct: ConstructBase,
	context: ParserVisitContext,
) => ParserVisitContext;

export interface ParserVisitContext {
	readonly construct: ConstructBase;
	captureChildConstruct(child: ConstructBase): void;
	onBeforeConstruct(construct: ConstructBase): ParserVisitContext;
	parent(): ParserVisitContext | undefined;
	readonly markdown: string;
}
