import type { Root } from 'mdast';

import type { ConstructBase, ContainerConstructBase } from '../../constructs';

export type OnBeforeConstruct = (
	construct: ConstructBase,
	context: ParserVisitContext,
) => ParserVisitContext;

export type ParserSource = {
	readonly tree: Root;
	readonly markdown: string;
};

export type ParserVisitContext = {
	readonly construct: ConstructBase;
	readonly source: ParserSource;
	captureChildConstruct(child: ConstructBase): void;
	onBeforeConstruct(construct: ConstructBase): ParserVisitContext;
	childContext(
		construct: ContainerConstructBase,
		onBeforeConstruct?: OnBeforeConstruct,
	): ParserVisitContext;
	parent(): ParserVisitContext | undefined;
};
