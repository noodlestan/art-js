import type { ConstructBase, ContainerConstructBase } from '../../../constructs';
import type { OnBeforeConstruct, ParserSource, ParserVisitContext } from '../types';

export function createParserVisitContextBase(
	source: ParserSource,
	construct: ContainerConstructBase,
	parentContext: ParserVisitContext | undefined,
	onBeforeConstruct?: OnBeforeConstruct,
): ParserVisitContext {
	const context: ParserVisitContext = {
		construct,
		source,
		captureChildConstruct(child: ConstructBase) {
			construct.children.push(child);
		},
		onBeforeConstruct(construct: ConstructBase) {
			return onBeforeConstruct ? onBeforeConstruct(construct, context) : context;
		},
		childContext(construct: ContainerConstructBase, onBeforeConstruct?: OnBeforeConstruct) {
			return createParserVisitContextBase(source, construct, context, onBeforeConstruct);
		},
		parent() {
			return parentContext;
		},
	};

	return context;
}
