import { describe, expect, it } from 'vitest';

import { rawSlice } from './rawSlice';

describe('rawSlice', () => {
	it('FOR a node with position returns the raw slice', () => {
		const node = {
			type: 'text',
			position: {
				start: { line: 1, column: 1, offset: 0 },
				end: { line: 1, column: 6, offset: 5 },
			},
		};
		const context = { source: { markdown: 'Hello world' } } as never;

		const result = rawSlice(node, context);

		expect(result).toBe('Hello');
	});

	it('WHEN node lacks position returns empty string', () => {
		const node = { type: 'text' };
		const context = { source: { markdown: 'Hello world' } } as never;

		const result = rawSlice(node, context);

		expect(result).toBe('');
	});

	it('WHEN node lacks position end returns empty string', () => {
		const node = {
			type: 'text',
			position: {
				start: { line: 1, column: 1, offset: 0 },
			},
		} as never;
		const context = { source: { markdown: 'Hello world' } } as never;

		const result = rawSlice(node, context);

		expect(result).toBe('');
	});
});
