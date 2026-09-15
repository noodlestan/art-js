import { describe, expect, it, vi } from 'vitest';

import { isFieldStrong } from './isFieldStrong';

vi.mock('./stripStrong', () => ({
	stripStrong: vi.fn(() => 'Purpose:'),
}));

describe('isFieldStrong', () => {
	it('returns true for a strong node matching field pattern', () => {
		const node = { type: 'strong', children: [{ type: 'text', value: 'Purpose:' }] };
		const result = isFieldStrong(node, { markdown: '**Purpose:**' } as never);
		expect(result).toBe(true);
	});

	it('returns false for non-strong node', () => {
		const node = { type: 'text', value: 'Purpose:' };
		const result = isFieldStrong(node, { markdown: 'Purpose:' } as never);
		expect(result).toBe(false);
	});
});
