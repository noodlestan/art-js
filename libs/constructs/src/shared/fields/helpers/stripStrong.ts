import type { ParserVisitContext } from '@art-js/primitives';
import type { Strong } from 'mdast';

import { rawSlice } from '../../mdast';

export function stripStrong(node: Strong, context: ParserVisitContext): string {
	const raw = rawSlice(node, context);
	return raw.length >= 4 &&
		((raw.startsWith('**') && raw.endsWith('**')) || (raw.startsWith('__') && raw.endsWith('__')))
		? raw.slice(2, -2)
		: raw;
}
