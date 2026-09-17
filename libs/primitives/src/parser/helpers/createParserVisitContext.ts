import type { ConstructBase, ContainerConstructBase } from '../../index';
import type { OnBeforeConstruct, ParserVisitContext } from '../index';

export function createParserVisitContext(
	construct: ContainerConstructBase,
	parentContext: ParserVisitContext | undefined,
	markdown?: string,
	onBeforeConstruct?: OnBeforeConstruct,
): ParserVisitContext {
	const context: ParserVisitContext = {
		construct,
		captureChildConstruct(child: ConstructBase) {
			construct.children.push(child);
		},
		onBeforeConstruct(construct: ConstructBase) {
			return onBeforeConstruct ? onBeforeConstruct(construct, context) : context;
		},
		parent() {
			return parentContext;
		},
		markdown: markdown ?? parentContext?.markdown ?? '',
	};

	return context;
}
