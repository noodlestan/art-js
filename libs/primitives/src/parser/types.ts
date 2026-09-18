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

/** A point in the source. */
export type Point = {
	line: number;
	column: number;
	offset: number;
};

/** The source span of a record. */
export type Position = {
	start: Point;
	end: Point;
};
