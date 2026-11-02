import { describe, expect, it } from 'vitest';

import { isReservedFieldName } from './isReservedFieldName.js';

describe('isReservedFieldName', () => {
	it('GIVEN a handle member name THEN it is reserved', () => {
		expect(isReservedFieldName('save')).toBe(true);
	});

	it('GIVEN the reserved prefix THEN it is reserved', () => {
		expect(isReservedFieldName('__private')).toBe(true);
	});

	it('GIVEN an ordinary field name THEN it is not reserved', () => {
		expect(isReservedFieldName('userId')).toBe(false);
	});

	it('GIVEN a single leading underscore THEN it is not reserved', () => {
		expect(isReservedFieldName('_single')).toBe(false);
	});
});
