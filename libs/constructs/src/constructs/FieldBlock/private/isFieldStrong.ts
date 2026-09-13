import type { ParserVisitContext } from '@art-js/primitives';
import type { Node, Strong } from 'mdast';

import { FIELD_TEXT_PATTERN } from './constants';
import { stripStrong } from './stripStrong';

export function isFieldStrong(node: Node, context: ParserVisitContext): node is Strong {
	return node.type === 'strong' && FIELD_TEXT_PATTERN.test(stripStrong(node as Strong, context));
}
