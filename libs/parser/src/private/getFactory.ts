import type { ConstructParser } from '@art-js/constructs';
import type { MdastNode, VisitContext } from '@art-js/primitives';

export function getFactory(
	node: MdastNode,
	context: VisitContext,
	constructs: ConstructParser[],
): ConstructParser | null {
	for (const construct of constructs.slice(1)) {
		const factory = construct.factory;
		if (factory?.detect(node, context)) return construct;
	}
	return null;
}
