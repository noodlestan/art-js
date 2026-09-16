import { describe, expect, it } from 'vitest';

import { isBlockType } from './isBlockType';

describe('isBlockType', () => {
	it('FOR known block types returns true', () => {
		const resultParagraph = isBlockType('paragraph');

		const resultCode = isBlockType('code');

		expect(resultParagraph).toBe(true);
		expect(resultCode).toBe(true);
	});

	it('FOR unknown block types returns false', () => {
		const result = isBlockType('unknown');
		expect(result).toBe(false);
	});
});
