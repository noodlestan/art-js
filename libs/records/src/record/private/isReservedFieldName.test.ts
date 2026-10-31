import { describe, expect, it } from 'vitest';

import { isCanonicalFieldName } from './isCanonicalFieldName.js';
import {
	canonicalReservedNameCases,
	nonReservedNameCases,
	reservedNameCases,
} from './isReservedFieldName.fixtures.js';
import { isReservedFieldName } from './isReservedFieldName.js';

describe('isReservedFieldName', () => {
	it.each(reservedNameCases)('GIVEN name "%s" provided THEN it is reserved', name => {
		expect(isReservedFieldName(name)).toBe(true);
	});

	it.each(nonReservedNameCases)('GIVEN name "%s" provided THEN it is not reserved', name => {
		expect(isReservedFieldName(name)).toBe(false);
	});

	it.each(canonicalReservedNameCases)(
		'GIVEN name "%s" provided THEN it is both canonical and reserved',
		name => {
			expect(isCanonicalFieldName(name)).toBe(true);
			expect(isReservedFieldName(name)).toBe(true);
		},
	);
});
