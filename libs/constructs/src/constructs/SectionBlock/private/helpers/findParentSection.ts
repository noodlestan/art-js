import type { ParserVisitContext } from '@art-js/primitives';

import type { SectionBlock } from '../../types';

export function findParentSection(context: ParserVisitContext): SectionBlock | undefined {
	let current: ParserVisitContext | undefined = context;
	while (current) {
		if (current.construct?.construct === 'SectionBlock') {
			return current.construct as SectionBlock;
		}
		current = current.parent();
	}
	return undefined;
}
