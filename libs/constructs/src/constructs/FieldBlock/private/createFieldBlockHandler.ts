import type { ConstructBase, ParserVisitContext } from '@art-js/primitives';
import { createParserVisitContext } from '@art-js/primitives';

import type { ConstructHandler } from '../../types';

import type { FieldBlock } from './types';

const FIELD_BLOCK_BOUNDARIES = new Set(['FieldBlock', 'FieldInline', 'SectionBlock']);

function closeFieldBlock(record: ConstructBase, context: ParserVisitContext): ParserVisitContext {
	if (!FIELD_BLOCK_BOUNDARIES.has(record.construct)) return context;

	const parent = context.parent();
	if (!parent) return context;

	parent.lastEnd = context.lastEnd;
	return parent;
}

export function createFieldBlockHandler(): ConstructHandler {
	return {
		handle(record, _node, context) {
			const field = record as FieldBlock;
			context.push(field);
			const newCtx = createParserVisitContext(
				field,
				context,
				undefined,
				field.children,
				closeFieldBlock,
			);
			newCtx.lastEnd = context.lastEnd;
			return newCtx;
		},
	};
}
