import type { FieldInline } from '@art-md/constructs';
import { describe, expect, it } from 'vitest';

import { getExposedFieldNames } from './getExposedFieldNames.js';
import type { FieldIndex, FieldName, SectionField } from './types.js';

function makeSectionField(name: FieldName): FieldInline {
	return {
		construct: 'FieldInline',
		name,
		children: [],
	};
}

function makeFieldIndex(entries: ReadonlyArray<readonly [FieldName, FieldName]>): FieldIndex {
	return new Map<FieldName, SectionField>(
		entries.map(([indexedName, label]) => [indexedName, makeSectionField(label)]),
	);
}

describe('getExposedFieldNames', () => {
	it('GIVEN an index holding reserved and exposed names WHEN listing THEN reserved names are excluded', () => {
		const fields = makeFieldIndex([
			['name', 'Name'],
			['purpose', 'Purpose'],
			['__section', '__section'],
			['save', 'Save'],
			['brandNew', 'Brand New'],
		]);

		expect(getExposedFieldNames(fields)).toEqual(['purpose', 'brandNew']);
	});

	it('GIVEN an index holding an extracted non-canonical name WHEN listing THEN the name is exposed', () => {
		const fields = makeFieldIndex([['3A33', '3A33']]);

		expect(getExposedFieldNames(fields)).toEqual(['3A33']);
	});

	it('GIVEN an empty index WHEN listing THEN no names are exposed', () => {
		const fields = makeFieldIndex([]);

		expect(getExposedFieldNames(fields)).toEqual([]);
	});
});
