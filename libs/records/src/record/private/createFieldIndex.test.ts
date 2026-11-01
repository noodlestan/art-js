import type { FieldInline, SectionBlock } from '@art-md/constructs';
import type { ConstructBase } from '@art-md/primitives';
import { describe, expect, it } from 'vitest';

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

	it('GIVEN an empty section WHEN indexing THEN the index is empty', () => {
		const section = makeSection([]);

		const index = createFieldIndex(section);

		expect(index.size).toBe(0);
		expect(index).toBeInstanceOf(Map);
	});
});
