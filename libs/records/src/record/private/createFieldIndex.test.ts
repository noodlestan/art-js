import type { FieldInline, SectionBlock } from '@art-md/constructs';
import type { ConstructBase } from '@art-md/primitives';
import { describe, expect, it } from 'vitest';

import { createRecord } from '../createRecord.js';

import { createFieldIndex } from './createFieldIndex.js';

function makeSectionField(name: string, value: string): FieldInline {
	return {
		construct: 'FieldInline',
		name,
		children: [{ construct: 'NaturalExpression', type: 'text', value, children: [] }],
	};
}

function makeSection(children: ConstructBase[]): SectionBlock {
	return {
		construct: 'SectionBlock',
		name: 'Test',
		depth: 1,
		children,
	};
}

const reservedLabelCases = [
	['Name', 'name'],
	['Save', 'save'],
	['Rename Field', 'renameField'],
] as const;

describe('createFieldIndex', () => {
	it('GIVEN fields converting to the same name WHEN indexing THEN the first occurrence wins in document order', () => {
		const section = makeSection([
			makeSectionField('Purpose', 'First'),
			makeSectionField('purpose', 'Second'),
		]);

		const index = createFieldIndex(section);

		expect(index.get('purpose')).toBe(section.children[0]);
	});

	it('GIVEN fields converting to the same name WHEN indexing THEN the later duplicate is not indexed', () => {
		const section = makeSection([
			makeSectionField('Purpose', 'First'),
			makeSectionField('purpose', 'Second'),
		]);

		const index = createFieldIndex(section);

		expect(index.size).toBe(1);
	});

	it('GIVEN a digit-led label WHEN indexing THEN it registers under its extracted name', () => {
		const section = makeSection([makeSectionField('3A33', 'Digit Led')]);

		const index = createFieldIndex(section);

		expect(index.get('3A33')).toBe(section.children[0]);
	});

	it.each(reservedLabelCases)(
		'GIVEN the label "%s" converting to the reserved name "%s" WHEN indexing THEN the TypeError names both',
		(label, reservedName) => {
			const section = makeSection([makeSectionField(label, 'Value')]);

			expect(() => createFieldIndex(section)).toThrow(
				`Field label "${label}" resolves to reserved name "${reservedName}"`,
			);
		},
	);

	it('GIVEN labels led by a double underscore WHEN indexing THEN they register under their converted names', () => {
		const section = makeSection([
			makeSectionField('__section', 'Section'),
			makeSectionField('__foo', 'Foo'),
		]);

		const index = createFieldIndex(section);

		expect(index.get('section')).toBe(section.children[0]);
		expect(index.get('foo')).toBe(section.children[1]);
		expect(index.size).toBe(2);
	});

	it('GIVEN a reserved label inserted past the guards WHEN rebuilding after a removal THEN the same TypeError is thrown', () => {
		const record = createRecord({ codec: {} as never, contentSource: {} as never });

		// eslint-disable-next-line dot-notation
		record['purpose'] = 'First';
		record.__section.children.push(makeSectionField('Name', 'Injected'));

		expect(() => {
			// eslint-disable-next-line dot-notation
			delete record['purpose'];
		}).toThrow('Field label "Name" resolves to reserved name "name"');
	});

	it('GIVEN an empty section WHEN indexing THEN the index is empty', () => {
		const section = makeSection([]);

		const index = createFieldIndex(section);

		expect(index.size).toBe(0);
		expect(index).toBeInstanceOf(Map);
	});
});
