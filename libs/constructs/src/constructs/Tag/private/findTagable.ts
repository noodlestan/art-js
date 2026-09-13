import type { ParserVisitContext } from '@art-js/primitives';

export function findTagable(context: ParserVisitContext): unknown | undefined {
	let current: ParserVisitContext | undefined = context;
	while (current) {
		if (current.construct?.construct === 'SectionBlock') {
			return current.construct;
		}
		current = current.parent();
	}
	return undefined;
}
