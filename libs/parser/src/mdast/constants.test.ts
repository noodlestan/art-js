import { describe, expect, it } from 'vitest';

import { BLOCK_TYPES } from './constants';

describe('BLOCK_TYPES', () => {
	it('contains expected block types', () => {
		expect(BLOCK_TYPES.has('paragraph')).toBe(true);
		expect(BLOCK_TYPES.has('code')).toBe(true);
		expect(BLOCK_TYPES.has('list')).toBe(true);
		expect(BLOCK_TYPES.has('unknown')).toBe(false);
	});
});
