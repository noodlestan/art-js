import { describe, expect, it } from 'vitest';

import { isCanonicalFieldName } from './isCanonicalFieldName.js';

describe('isCanonicalFieldName', () => {
	it('GIVEN a camel case name THEN it is canonical', () => {
		expect(isCanonicalFieldName('repo2Branch')).toBe(true);
	});

	it('GIVEN a leading digit THEN it is not canonical', () => {
		expect(isCanonicalFieldName('2Branch')).toBe(false);
	});

	it('GIVEN a separator THEN it is not canonical', () => {
		expect(isCanonicalFieldName('canonical name')).toBe(false);
	});
});
