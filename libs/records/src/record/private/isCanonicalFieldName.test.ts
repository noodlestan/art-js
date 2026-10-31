import { describe, expect, it } from 'vitest';

import { canonicalNameCases } from './isCanonicalFieldName.fixtures.js';
import { isCanonicalFieldName } from './isCanonicalFieldName.js';

describe('isCanonicalFieldName', () => {
	it.each(canonicalNameCases)('GIVEN name "%s" provided THEN canonical is %s', (name, expected) => {
		expect(isCanonicalFieldName(name)).toBe(expected);
	});
});
