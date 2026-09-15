import { describe, expect, it, vi } from 'vitest';

import { stripStrong } from './stripStrong';

vi.mock('../../../helpers/rawSlice', () => ({
	rawSlice: vi.fn((_node, _context) => {
		const markdown = (_context as { markdown: string }).markdown;
		return markdown;
	}),
}));

describe('stripStrong', () => {
	it('strips ** wrappers', () => {
		const result = stripStrong({ type: 'strong', children: [] }, {
			markdown: '**hello**',
		} as never);
		expect(result).toBe('hello');
	});

	it('strips __ wrappers', () => {
		const result = stripStrong({ type: 'strong', children: [] }, {
			markdown: '__hello__',
		} as never);
		expect(result).toBe('hello');
	});

	it('returns raw when not wrapped', () => {
		const result = stripStrong({ type: 'strong', children: [] }, { markdown: 'hello' } as never);
		expect(result).toBe('hello');
	});
});
