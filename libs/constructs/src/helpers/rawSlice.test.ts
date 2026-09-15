import { describe, expect, it } from 'vitest';

import { rawSlice } from './rawSlice';

describe('rawSlice', () => {
	it('returns the raw slice for a node with position', () => {
		const node = {
			type: 'text',
			position: {
				start: { line: 1, column: 1, offset: 0 },
				end: { line: 1, column: 6, offset: 5 },
			},
		};
		const context = { markdown: 'Hello world' } as never;
		expect(rawSlice(node, context)).toBe('Hello');
	});

	it('returns empty string when node lacks position', () => {
		const node = { type: 'text' };
		const context = { markdown: 'Hello world' } as never;
		expect(rawSlice(node, context)).toBe('');
	});
});
