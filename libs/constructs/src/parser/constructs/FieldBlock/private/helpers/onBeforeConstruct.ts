import type { ConstructBase, ParserVisitContext } from '@art-js/primitives';

const FIELD_BLOCK_BOUNDARIES = new Set(['FieldBlock', 'FieldInline', 'SectionBlock']);

export function onBeforeConstruct(
	construct: ConstructBase,
	context: ParserVisitContext,
): ParserVisitContext {
	if (!FIELD_BLOCK_BOUNDARIES.has(construct.construct)) {
		return context;
	}

	const parent = context.parent();
	if (!parent) {
		return context;
	}

	return parent;
}
