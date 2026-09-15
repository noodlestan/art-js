import { describe, expect, it } from 'vitest';

import { BLOCK_TYPES } from './constants';

describe('BLOCK_TYPES', () => {
	it('contains expected block types', () => {
		const resultParagraph = BLOCK_TYPES.has('paragraph');
		const resultCode = BLOCK_TYPES.has('code');
		const resultList = BLOCK_TYPES.has('list');
		const resultUnknown = BLOCK_TYPES.has('unknown');
		expect(resultParagraph).toBe(true);
		expect(resultCode).toBe(true);
		expect(resultList).toBe(true);
		expect(resultUnknown).toBe(false);
	});
});
