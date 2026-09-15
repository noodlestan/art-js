import { describe, expect, it } from 'vitest';

import { sectionDepth } from './sectionDepth';

describe('sectionDepth', () => {
	it('returns the depth when provided', () => {
		expect(sectionDepth({ depth: 3 })).toBe(3);
	});

	it('defaults to 1 when depth is missing', () => {
		expect(sectionDepth({})).toBe(1);
	});
});
