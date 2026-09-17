import type { Node } from 'unist';

import type { Position } from '../../index';

export function nodePosition(node: Node): Position {
	if (!node.position) {
		throw new Error(`Expected source position for ${node.type}`);
	}

	const raw = node.position;

	if (!raw?.start || !raw.end) {
		throw new Error(`Expected source position for ${node.type}`);
	}
	return {
		start: {
			line: raw.start.line,
			column: raw.start.column,
			offset: raw.start.offset ?? 0,
		},
		end: {
			line: raw.end.line,
			column: raw.end.column,
			offset: raw.end.offset ?? 0,
		},
	};
}
