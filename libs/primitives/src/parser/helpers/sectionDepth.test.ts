import { describe, expect, it } from 'vitest';

import { sectionDepth } from './sectionDepth';

describe('sectionDepth', () => {
	it('WHEN provided returns the depth', () => {
		const result = sectionDepth({ depth: 3 });
		expect(result).toBe(3);
	});

	it('WHEN depth is missing defaults to 1', () => {
		const result = sectionDepth({});
		expect(result).toBe(1);
	});
});
