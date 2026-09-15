import { describe, expect, it } from 'vitest';

import { nodePosition } from './nodePosition';

describe('nodePosition', () => {
	it('returns the position for a node with valid position', () => {
		const node = {
			type: 'text',
			position: {
				start: { line: 1, column: 1, offset: 0 },
				end: { line: 1, column: 6, offset: 5 },
			},
		};
		const result = nodePosition(node);
		expect(result).toEqual({
			start: { line: 1, column: 1, offset: 0 },
			end: { line: 1, column: 6, offset: 5 },
		});
	});

	it('throws when node has no position', () => {
		expect(() => nodePosition({ type: 'text' })).toThrow('Expected source position for text');
	});

	it('throws when position lacks start or end', () => {
		expect(() => nodePosition({ type: 'text', position: {} as never })).toThrow(
			'Expected source position for text',
		);
	});

	it('defaults to 0 when offset is missing', () => {
		const node = {
			type: 'text',
			position: {
				start: { line: 1, column: 1 },
				end: { line: 1, column: 6 },
			},
		};
		const result = nodePosition(node);
		expect(result.start.offset).toBe(0);
		expect(result.end.offset).toBe(0);
	});
});
