import { createArtCodec } from '@art-md/codec';
import type { NaturalBlock, NaturalExpression, SectionBlock } from '@art-md/constructs';
import type { ArtDocument } from '@art-md/primitives';
import { describe, expect, it } from 'vitest';

import { createRecord } from '../../createRecord.js';
import type { ArtRecord } from '../../types.js';
import { isSectionField } from '../section-field/isSectionField.js';
import type { SectionField } from '../types.js';

const codec = createArtCodec();

const containerValueError =
	'Field value must not be a Document, SectionBlock, FieldBlock, or FieldInline';

const invalidValueError = 'Field value must be a string, number, boolean, or Art AST value';

function createTestRecord(): ArtRecord {
	return createRecord({ codec, contentSource: {} as never });
}

function getFirstSectionField(record: ArtRecord): SectionField {
	const firstChild = record.__section.children[0];
	if (firstChild === undefined || !isSectionField(firstChild)) {
		throw new Error('Expected the first section child to be a field');
	}

	return firstChild;
}

describe('createRecordCapsule', () => {
	it('GIVEN a markup value WHEN reading it back THEN the accessor and the markdown read return markdown and the text read strips it', () => {
		const record = createTestRecord();

		// eslint-disable-next-line dot-notation
		record['greeting'] = 'Hello, are _you_ there _world_?';

		// eslint-disable-next-line dot-notation
		expect(record['greeting']).toBe('Hello, are _you_ there _world_?');
		expect(record.getFieldMarkdown('greeting')).toBe('Hello, are _you_ there _world_?');
		expect(record.getFieldText('greeting')).toBe('Hello, are you there world?');
	});

	it('GIVEN a markdown write WHEN reading it back THEN the input round-trips without the serializer newline', () => {
		const record = createTestRecord();
		const markdown = 'Hello, are _you_ there _world_?';

		record.setFieldMarkdown('greeting', markdown);

		expect(record.getFieldMarkdown('greeting')).toBe(markdown);
		expect(record.getFieldMarkdown('greeting')).not.toMatch(/\n$/);
		// eslint-disable-next-line dot-notation
		expect(record['greeting']).toBe(markdown);
	});

	it('GIVEN a code-span value WHEN updating another field THEN the authored form survives the update', () => {
		const record = createTestRecord();

		// eslint-disable-next-line dot-notation
		record['location'] = '`art-works`';
		// eslint-disable-next-line dot-notation
		record['purpose'] = 'Updated';

		expect(record.getFieldMarkdown('location')).toBe('`art-works`');
		expect(record.getFieldText('location')).toBe('art-works');
		// eslint-disable-next-line dot-notation
		expect(record['purpose']).toBe('Updated');
	});

	it('GIVEN a missing name WHEN reading all three reads THEN each returns undefined', () => {
		const record = createTestRecord();

		expect(record.getFieldMarkdown('missing')).toBeUndefined();
		expect(record.getFieldText('missing')).toBeUndefined();
		expect(record.getFieldValue('missing')).toBeUndefined();
	});

	it('GIVEN a code construct WHEN setting it through setFieldValue THEN the fence survives every read', () => {
		const record = createTestRecord();
		const code = codec.create<NaturalBlock>('NaturalBlock', {
			type: 'code',
			lang: 'typescript',
			value: '```typescript\nconst x = 42;\n```',
			children: [],
		});

		record.setFieldValue('codeExample', code);

		expect(record.getFieldValue('codeExample')).toEqual([code]);
		expect(record.getFieldText('codeExample')).toBe('```typescript\nconst x = 42;\n```');
		expect(record.getFieldMarkdown('codeExample')).toBe('```typescript\nconst x = 42;\n```');
	});

	it('GIVEN an array of constructs WHEN setting it through setFieldValue THEN they install in order', () => {
		const record = createTestRecord();
		const first = codec.create<NaturalExpression>('NaturalExpression', {
			type: 'text',
			value: 'first',
			children: [],
		});
		const second = codec.create<NaturalExpression>('NaturalExpression', {
			type: 'text',
			value: 'second',
			children: [],
		});

		record.setFieldValue('greeting', [first, second]);

		expect(record.getFieldValue('greeting')).toEqual([first, second]);
		expect(record.getFieldMarkdown('greeting')).toBe('firstsecond');
	});

	it('GIVEN a populated field WHEN reading the raw value twice THEN the clones are isolated from the document', () => {
		const record = createTestRecord();

		// eslint-disable-next-line dot-notation
		record['greeting'] = 'Hello _you_ there';

		const value = record.getFieldValue('greeting');
		if (value === undefined) {
			throw new Error('Expected the greeting field to hold a value');
		}

		const firstExpression = value[0];
		if (firstExpression === undefined || firstExpression.construct !== 'NaturalExpression') {
			throw new Error('Expected a text expression as the first value construct');
		}

		const markdownBefore = record.getFieldMarkdown('greeting');
		const sectionBefore = JSON.stringify(record.__section);
		const injected: NaturalExpression = {
			construct: 'NaturalExpression',
			type: 'text',
			value: ' injected',
			children: [],
		};

		firstExpression.children.push(injected);

		expect(record.getFieldMarkdown('greeting')).toBe(markdownBefore);
		expect(JSON.stringify(record.__section)).toBe(sectionBefore);
		expect(record.getFieldValue('greeting')).toHaveLength(3);
		expect(record.getFieldValue('greeting')).not.toBe(value);
	});

	it('GIVEN an empty value WHEN reading it back THEN the field clears and the raw read returns an empty array', () => {
		const record = createTestRecord();

		record.setFieldMarkdown('greeting', '');

		expect(record.getFieldMarkdown('greeting')).toBe('');
		expect(record.getFieldValue('greeting')).toEqual([]);
		expect(getFirstSectionField(record).construct).toBe('FieldInline');
		expect(getFirstSectionField(record).name).toBe('Greeting');
		expect(getFirstSectionField(record).children).toEqual([]);

		record.setFieldValue('greeting', []);

		expect(record.getFieldValue('greeting')).toEqual([]);
		expect(getFirstSectionField(record).construct).toBe('FieldInline');
		expect(getFirstSectionField(record).children).toEqual([]);
	});

	it('GIVEN number and boolean writes WHEN reading them back THEN the coerced strings are stored', () => {
		const record = createTestRecord();

		// eslint-disable-next-line dot-notation
		record['count'] = 42;
		// eslint-disable-next-line dot-notation
		record['active'] = true;

		expect(record.getFieldMarkdown('count')).toBe('42');
		expect(record.getFieldMarkdown('active')).toBe('true');
		expect(record.getFieldText('count')).toBe('42');
	});

	it('GIVEN a block value WHEN appending a new field THEN the field takes the block form', () => {
		const record = createTestRecord();

		// eslint-disable-next-line dot-notation
		record['codeExample'] = '```typescript\nconst x = 42;\n```';

		expect(getFirstSectionField(record).construct).toBe('FieldBlock');
		expect(getFirstSectionField(record).name).toBe('Code Example');
	});

	it('GIVEN a rejected value WHEN writing through the proxy THEN the spec TypeErrors are thrown and nothing is appended', () => {
		const record = createTestRecord();
		const documentValue: ArtDocument = { construct: 'Document', children: [] };
		const sectionValue: SectionBlock = {
			construct: 'SectionBlock',
			name: 'Nested',
			depth: 2,
			children: [],
		};

		expect(() => {
			// eslint-disable-next-line dot-notation
			record['location'] = null;
		}).toThrow(invalidValueError);
		expect(() => {
			// eslint-disable-next-line dot-notation
			record['location'] = documentValue;
		}).toThrow(containerValueError);
		expect(() => {
			// eslint-disable-next-line dot-notation
			record['location'] = [sectionValue];
		}).toThrow(containerValueError);
		expect(() => {
			record.setFieldValue('location', sectionValue);
		}).toThrow(containerValueError);
		expect(record.__section.children).toHaveLength(0);
	});

	it('GIVEN the five new handle members WHEN reading them off the handle THEN each is a function', () => {
		const record = createTestRecord();

		expect(typeof record.setFieldMarkdown).toBe('function');
		expect(typeof record.setFieldValue).toBe('function');
		expect(typeof record.getFieldMarkdown).toBe('function');
		expect(typeof record.getFieldText).toBe('function');
		expect(typeof record.getFieldValue).toBe('function');
	});

	it('GIVEN a derived label WHEN relabelling to the house spelling THEN only the stored label changes', () => {
		const record = createTestRecord();

		record.setFieldMarkdown('npmPackageDeployment', 'Build the package');
		const keysBefore = Object.keys(record);

		record.relabelField('npmPackageDeployment', 'NPM Package Deployment');

		expect(JSON.stringify(record.__section)).toContain('"name":"NPM Package Deployment"');
		expect(record.getFieldMarkdown('npmPackageDeployment')).toBe('Build the package');
		expect(Object.keys(record)).toEqual(keysBefore);
	});

	it('GIVEN a rejected relabel WHEN running the gates THEN they fire in the spec order and nothing changes', () => {
		const record = createTestRecord();

		record.setFieldMarkdown('purpose', 'First');
		const sectionBefore = JSON.stringify(record.__section);
		const keysBefore = Object.keys(record);

		expect(() => {
			record.relabelField('save', 'Save');
		}).toThrow('Reserved record field name: "save"');
		expect(() => {
			record.relabelField('missing', 'Missing');
		}).toThrow('Field not found: missing');
		expect(() => {
			record.relabelField('purpose', '   ');
		}).toThrow('Field label must contain at least one word character');
		expect(() => {
			record.relabelField('purpose', '3A33');
		}).toThrow('Invalid record field label: "3A33"');
		expect(() => {
			record.relabelField('purpose', 'Other Name');
		}).toThrow('Field label "Other Name" does not match field name "purpose"');

		expect(JSON.stringify(record.__section)).toBe(sectionBefore);
		expect(Object.keys(record)).toEqual(keysBefore);
	});

	it('GIVEN label-addressed reads WHEN resolving an exact label THEN hits reach the field and misses return undefined', () => {
		const record = createTestRecord();

		record.setFieldMarkdown('purpose', 'First');

		expect(record.getFieldMarkdownByLabel('Purpose')).toBe('First');
		expect(record.getFieldTextByLabel('Purpose')).toBe('First');
		expect(record.getFieldValueByLabel('Purpose')).toHaveLength(1);
		expect(record.getFieldMarkdownByLabel('purpose')).toBeUndefined();
		expect(record.getFieldTextByLabel('purpose')).toBeUndefined();
		expect(record.getFieldValueByLabel('purpose')).toBeUndefined();
	});

	it('GIVEN a label-addressed write miss WHEN resolving it THEN it throws and never creates a field', () => {
		const record = createTestRecord();

		record.setFieldMarkdown('purpose', 'First');
		const childrenBefore = record.__section.children.length;

		// A non-canonical label must never reach the name grammar: the miss
		// reports the label itself, not an invalid field name.
		expect(() => {
			record.setFieldMarkdownByLabel('Not Canonical', 'Updated');
		}).toThrow('Field not found: Not Canonical');
		expect(() => {
			record.setFieldValueByLabel('Missing', []);
		}).toThrow('Field not found: Missing');

		expect(record.__section.children).toHaveLength(childrenBefore);
	});

	it('GIVEN a label-addressed write hit WHEN routing it THEN the value semantics are the name-addressed ones', () => {
		const record = createTestRecord();

		record.setFieldMarkdown('purpose', 'First');

		record.setFieldMarkdownByLabel('Purpose', '```typescript\nconst x = 42;\n```');

		expect(record.getFieldTextByLabel('Purpose')).toContain('const x = 42;');
		expect(record.getFieldMarkdown('purpose')).toContain('```typescript');
		expect(JSON.stringify(record.__section)).toContain('"name":"Purpose"');
	});
});
