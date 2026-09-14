import type { ConstructBase, ParserVisitContext } from '@art-js/primitives';
import { createParserVisitContext } from '@art-js/primitives';

import type { ConstructHandler } from '../../types';

import type { FieldBlock } from './types';

const FIELD_BLOCK_BOUNDARIES = new Set(['FieldBlock', 'FieldInline', 'SectionBlock']);

function onBeforeConstruct(
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

export function createFieldBlockHandler(): ConstructHandler {
	return {
		handle(construct, _node, context) {
			const field = construct as FieldBlock;
			context.captureChildConstruct(field);
			return createParserVisitContext(field, context, undefined, onBeforeConstruct);
		},
	};
}
