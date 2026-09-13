import type { ConstructBase } from '../../constructs.js';
import type { BeforeRecord, ParserVisitContext } from '../types.js';

export function createParserVisitContext(
	construct: ConstructBase,
	parentContext: ParserVisitContext | undefined,
	markdown?: string,
	targetArray?: ConstructBase[],
	boundary?: BeforeRecord,
): ParserVisitContext {
	const children = targetArray ?? [];

	const ctx: ParserVisitContext = {
		construct,
		target() {
			return children;
		},
		push(record: ConstructBase) {
			children.push(record);
		},
		beforeRecord(record: ConstructBase) {
			return boundary ? boundary(record, ctx) : ctx;
		},
		parent() {
			return parentContext;
		},
		markdown: markdown ?? parentContext?.markdown ?? '',
		lastEnd: parentContext?.lastEnd,
	};

	return ctx;
}
