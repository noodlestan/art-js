import { describe, expect, it } from 'vitest';

import { sectionDepth } from './sectionDepth';

describe('sectionDepth', () => {
	it('returns the depth when provided', () => {
		const result = sectionDepth({ depth: 3 });
		expect(result).toBe(3);
	});

	it('defaults to 1 when depth is missing', () => {
		const result = sectionDepth({});
		expect(result).toBe(1);
	});
});
