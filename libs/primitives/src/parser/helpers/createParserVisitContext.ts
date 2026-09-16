import type { ConstructBase, ContainerConstructBase } from '../../types';
import type { OnBeforeConstruct, ParserVisitContext } from '../types';

export function createParserVisitContext(
	construct: ContainerConstructBase,
	parentContext: ParserVisitContext | undefined,
	markdown?: string,
	onBeforeConstruct?: OnBeforeConstruct,
): ParserVisitContext {
	const ctx: ParserVisitContext = {
		construct,
		captureChildConstruct(child: ConstructBase) {
			construct.children.push(child);
		},
		onBeforeConstruct(construct: ConstructBase) {
			return onBeforeConstruct ? onBeforeConstruct(construct, ctx) : ctx;
		},
		parent() {
			return parentContext;
		},
		markdown: markdown ?? parentContext?.markdown ?? '',
	};

	return ctx;
}
