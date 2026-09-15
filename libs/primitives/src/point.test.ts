import { describe, expect, it } from 'vitest';

import type { Point, Position } from './point';

describe('Point type', () => {
	it('accepts a valid point', () => {
		const point: Point = { line: 1, column: 1, offset: 0 };
		expect(point.line).toBe(1);
		expect(point.column).toBe(1);
		expect(point.offset).toBe(0);
	});
});

describe('Position type', () => {
	it('accepts a valid position', () => {
		const position: Position = {
			start: { line: 1, column: 1, offset: 0 },
			end: { line: 2, column: 1, offset: 10 },
		};
		expect(position.start.line).toBe(1);
		expect(position.end.line).toBe(2);
	});
});
