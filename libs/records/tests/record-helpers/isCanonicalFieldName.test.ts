import { describe, expect, it } from 'vitest';

import { isCanonicalFieldName } from '../../src/record/private/isCanonicalFieldName.js';

import { canonicalNameCases } from './isCanonicalFieldName.fixtures.js';

describe('isCanonicalFieldName', () => {
	it.each(canonicalNameCases)('GIVEN name "%s" provided THEN canonical is %s', (name, expected) => {
		expect(isCanonicalFieldName(name)).toBe(expected);
	});
});
