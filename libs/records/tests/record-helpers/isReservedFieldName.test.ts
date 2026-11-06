import { describe, expect, it } from 'vitest';

import { RESERVED_FIELD_NAMES } from '../../src/record/private/constants.js';
import { isCanonicalFieldName } from '../../src/record/private/field-name/isCanonicalFieldName.js';
import { isReservedFieldName } from '../../src/record/private/field-name/isReservedFieldName.js';

import {
	canonicalReservedNameCases,
	nonReservedNameCases,
	reservedNameCases,
} from './isReservedFieldName.fixtures.js';

describe('isReservedFieldName', () => {
	it('GIVEN the reserved set WHEN counting it THEN it holds the fifteen handle-member names', () => {
		expect(RESERVED_FIELD_NAMES).toHaveLength(15);
		expect(RESERVED_FIELD_NAMES).toEqual([
			'name',
			'save',
			'renameField',
			'__section',
			'setFieldMarkdown',
			'setFieldValue',
			'getFieldMarkdown',
			'getFieldText',
			'getFieldValue',
			'relabelField',
			'setFieldMarkdownByLabel',
			'setFieldValueByLabel',
			'getFieldMarkdownByLabel',
			'getFieldTextByLabel',
			'getFieldValueByLabel',
		]);
	});
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
