import { describe, expect, it } from 'vitest';

import { isBlockType } from './isBlockType';

describe('isBlockType', () => {
	it('returns true for known block types', () => {
		const resultParagraph = isBlockType('paragraph');
		const resultCode = isBlockType('code');
		expect(resultParagraph).toBe(true);
		expect(resultCode).toBe(true);
	});

	it('returns false for unknown block types', () => {
		const result = isBlockType('unknown');
		expect(result).toBe(false);
	});
});
