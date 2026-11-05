import { createArtCodec } from '@art-md/codec';
import type { BlockContent, NaturalExpression, SectionBlock } from '@art-md/constructs';
import type { ArtDocument } from '@art-md/primitives';
import { describe, expect, it } from 'vitest';

import type { ClassifiedSectionFieldValue } from '../types.js';

import { classifySectionFieldValue } from './classifySectionFieldValue.js';

const codec = createArtCodec();

const containerValueError =
	'Field value must not be a Document, SectionBlock, FieldBlock, or FieldInline';

const invalidValueError = 'Field value must be a string, number, boolean, or Art AST value';

const invalidValueCases: ReadonlyArray<readonly [unknown]> = [
	[null],
	[undefined],
	[{ type: 'text', value: 'literal' }],
	[[null]],
	[['plain string']],
] as const;

function makeTextExpression(value: string): NaturalExpression {
	return { construct: 'NaturalExpression', type: 'text', value, children: [] };
}

function makeSection(): SectionBlock {
	return { construct: 'SectionBlock', name: 'Nested', depth: 2, children: [] };
}

function getInlineChildren(classified: ClassifiedSectionFieldValue): NaturalExpression[] {
	if (classified.form !== 'FieldInline') {
		throw new Error(`Expected FieldInline, received ${classified.form}`);
	}

	return classified.children;
}

function getBlockChildren(classified: ClassifiedSectionFieldValue): BlockContent[] {
	if (classified.form !== 'FieldBlock') {
		throw new Error(`Expected FieldBlock, received ${classified.form}`);
	}

	return classified.children;
}

describe('classifySectionFieldValue', () => {
	it('GIVEN an empty string WHEN classifying THEN the content is inline with no children', () => {
		const classified = classifySectionFieldValue(codec, '');

		expect(getInlineChildren(classified)).toEqual([]);
	});

	it('GIVEN an empty array WHEN classifying THEN the content is inline with no children', () => {
		const classified = classifySectionFieldValue(codec, []);

		expect(getInlineChildren(classified)).toEqual([]);
	});

	it('GIVEN a single-line string WHEN classifying THEN the parsed paragraph is unwrapped to expressions', () => {
		const classified = classifySectionFieldValue(codec, 'Hello, are _you_ there _world_?');
		const children = getInlineChildren(classified);

		expect(children.length).toBeGreaterThan(0);
		expect(classified.children.some(child => child.construct === 'NaturalBlock')).toBe(false);
		expect(children.map(child => child.type)).toContain('emphasis');
	});

	it('GIVEN a multi-line string WHEN classifying THEN the paragraph unwraps and keeps the line break', () => {
		const classified = classifySectionFieldValue(codec, 'Hello world!\n_How_ are **you**?');
		const children = getInlineChildren(classified);

		expect(children[0]).toMatchObject({ construct: 'NaturalExpression', value: 'Hello world!\n' });
	});

	it('GIVEN an array of expressions WHEN classifying THEN the members become inline content in order', () => {
		const expressions = [makeTextExpression('first'), makeTextExpression('second')];

		const classified = classifySectionFieldValue(codec, expressions);

		expect(getInlineChildren(classified)).toEqual(expressions);
	});

	it('GIVEN a single block construct WHEN classifying THEN the construct itself is the block content', () => {
		const block = { construct: 'NaturalBlock', type: 'code', value: 'const x = 42;', children: [] };

		const classified = classifySectionFieldValue(codec, block);

		expect(getBlockChildren(classified)).toEqual([block]);
	});

	it('GIVEN a fenced code string WHEN classifying THEN the parsed block keeps the block form', () => {
		const classified = classifySectionFieldValue(codec, '```typescript\nconst x = 42;\n```');
		const children = getBlockChildren(classified);

		expect(children).toHaveLength(1);
		expect(children[0]).toMatchObject({
			construct: 'NaturalBlock',
			type: 'code',
			value: '```typescript\nconst x = 42;\n```',
		});
	});

	it('GIVEN a number WHEN classifying THEN it is coerced to a string and parsed', () => {
		const classified = classifySectionFieldValue(codec, 42);
		const children = getInlineChildren(classified);

		expect(children).toHaveLength(1);
		expect(children[0]).toMatchObject({
			construct: 'NaturalExpression',
			type: 'text',
			value: '42',
		});
	});

	it('GIVEN a boolean WHEN classifying THEN it is coerced to a string and parsed', () => {
		const classified = classifySectionFieldValue(codec, true);
		const children = getInlineChildren(classified);

		expect(children[0]).toMatchObject({
			construct: 'NaturalExpression',
			type: 'text',
			value: 'true',
		});
	});

	it.each(invalidValueCases)(
		'GIVEN the invalid value "%s" WHEN classifying THEN the value TypeError is thrown',
		value => {
			expect(() => classifySectionFieldValue(codec, value)).toThrow(invalidValueError);
		},
	);

	it('GIVEN a Document value WHEN classifying THEN the container TypeError is thrown', () => {
		const documentValue: ArtDocument = { construct: 'Document', children: [] };

		expect(() => classifySectionFieldValue(codec, documentValue)).toThrow(containerValueError);
	});

	it('GIVEN a section construct as the value WHEN classifying THEN the container TypeError is thrown', () => {
		expect(() => classifySectionFieldValue(codec, makeSection())).toThrow(containerValueError);
	});

	it('GIVEN a section construct inside the value array WHEN classifying THEN the container TypeError is thrown', () => {
		expect(() => classifySectionFieldValue(codec, [makeSection()])).toThrow(containerValueError);
	});

	it('GIVEN a field construct as the value WHEN classifying THEN the container TypeError is thrown', () => {
		const fieldValue = { construct: 'FieldInline', name: 'Y', children: [] };

		expect(() => classifySectionFieldValue(codec, fieldValue)).toThrow(containerValueError);
	});

	it('GIVEN a string parsing to a field WHEN classifying THEN the container TypeError is thrown', () => {
		expect(() => classifySectionFieldValue(codec, '**Y:** v')).toThrow(containerValueError);
	});
});
