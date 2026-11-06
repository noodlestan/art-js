import type {
	FieldInline,
	NaturalBlock,
	NaturalExpression,
	SectionBlock,
} from '@art-md/constructs';
import { describe, expect, it } from 'vitest';

import { findSectionFieldByLabel } from './findSectionFieldByLabel.js';

function makeField(label: string, value: string): FieldInline {
	const expression: NaturalExpression = {
		construct: 'NaturalExpression',
		type: 'text',
		value,
		children: [],
	};

	return {
		construct: 'FieldInline',
		name: label,
		children: [expression],
	};
}

function makeSection(children: SectionBlock['children']): SectionBlock {
	return {
		construct: 'SectionBlock',
		name: 'Test Record',
		depth: 1,
		children,
	};
}

function findFieldText(section: SectionBlock, label: string): string | undefined {
	const field = findSectionFieldByLabel(section, label);
	const expression = field?.children[0];

	if (expression === undefined || expression.construct !== 'NaturalExpression') {
		return undefined;
	}

	return expression.value;
}

describe('findSectionFieldByLabel', () => {
	it('GIVEN two fields carrying the same label WHEN finding by label THEN the first in document order wins', () => {
		const section = makeSection([makeField('Purpose', 'First'), makeField('Purpose', 'Second')]);

		expect(findSectionFieldByLabel(section, 'Purpose')?.children[0]).toMatchObject({
			value: 'First',
		});
	});

	it('GIVEN labels differing only by spelling WHEN finding by label THEN the lookup is exact', () => {
		const section = makeSection([makeField('Id', 'First'), makeField('ID', 'Second')]);

		expect(findFieldText(section, 'Id')).toBe('First');
		expect(findFieldText(section, 'ID')).toBe('Second');
		expect(findFieldText(section, 'id')).toBeUndefined();
	});

	it('GIVEN non-field children WHEN scanning THEN they are skipped without throwing', () => {
		const paragraph: NaturalBlock = {
			construct: 'NaturalBlock',
			type: 'paragraph',
			value: 'Loose content',
			children: [],
		};
		const nested: SectionBlock = makeSection([makeField('Nested', 'Value')]);
		const section = makeSection([paragraph, nested, makeField('Purpose', 'First')]);

		expect(findFieldText(section, 'Purpose')).toBe('First');
		expect(findFieldText(section, 'Nested')).toBeUndefined();
	});

	it('GIVEN a label no field carries WHEN finding THEN it returns undefined', () => {
		const section = makeSection([makeField('Purpose', 'First')]);

		expect(findSectionFieldByLabel(section, 'Missing')).toBeUndefined();
	});
});
