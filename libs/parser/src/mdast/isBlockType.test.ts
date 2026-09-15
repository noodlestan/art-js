import { describe, expect, it } from 'vitest';

import { isBlockType } from './isBlockType';

describe('isBlockType', () => {
	it('returns true for known block types', () => {
		expect(isBlockType('paragraph')).toBe(true);
		expect(isBlockType('code')).toBe(true);
	});

	it('returns false for unknown block types', () => {
		expect(isBlockType('unknown')).toBe(false);
	});
});
