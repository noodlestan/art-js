import type { ConstructBase, ContainerConstructBase } from '../../constructs.js';
import type { OnBeforeRecord, ParserVisitContext } from '../types.js';

export function createParserVisitContext(
	construct: ContainerConstructBase,
	parentContext: ParserVisitContext | undefined,
	markdown?: string,
	onBeforeConstruct?: OnBeforeRecord,
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
