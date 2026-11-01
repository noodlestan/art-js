import type { FieldInline, SectionBlock } from '@art-md/constructs';
import { describe, expect, it } from 'vitest';

import { listSectionFieldNames } from './listSectionFieldNames.js';

function makeSectionField(name: string): FieldInline {
	return {
		construct: 'FieldInline',
		name,
		children: [],
	};
}

function makeSection(children: FieldInline[]): SectionBlock {
	return {
		construct: 'SectionBlock',
		name: 'Test',
		depth: 1,
		children,
	};
}

describe('listSectionFieldNames', () => {
	it('GIVEN loaded labels WHEN listing THEN raw labels are returned in document order', () => {
		const section = makeSection([makeSectionField('Purpose'), makeSectionField('3A33')]);

		expect(listSectionFieldNames(section)).toEqual(['Purpose', '3A33']);
	});

	it('GIVEN duplicated labels WHEN listing THEN every raw label is listed', () => {
		const section = makeSection([makeSectionField('Purpose'), makeSectionField('purpose')]);

		expect(listSectionFieldNames(section)).toEqual(['Purpose', 'purpose']);
	});
});
