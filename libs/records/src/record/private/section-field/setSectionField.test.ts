import { createArtCodec } from '@art-md/codec';
import type {
	FieldBlock,
	FieldInline,
	NaturalBlock,
	NaturalExpression,
	Tag,
} from '@art-md/constructs';
import type { Position } from '@art-md/primitives';
import { describe, expect, it } from 'vitest';

import { setSectionField } from './setSectionField.js';

const codec = createArtCodec();

function makePosition(): Position {
	return {
		start: { line: 1, column: 1, offset: 0 },
		end: { line: 3, column: 4, offset: 31 },
	};
}

function makeCodeNaturalBlock(): NaturalBlock {
	return {
		construct: 'NaturalBlock',
		type: 'code',
		value: '```typescript\nconst x = 42;\n```',
		children: [],
	};
}

function makeBlockField(): FieldBlock {
	const position = makePosition();
	const tag: Tag = { construct: 'Tag', name: 'fixture' };

	return {
		construct: 'FieldBlock',
		name: 'Code Example',
		children: [makeCodeNaturalBlock()],
		tags: [tag],
		position,
	};
}

function makeInlineField(value: string): FieldInline {
	const position = makePosition();
	const expression: NaturalExpression = {
		construct: 'NaturalExpression',
		type: 'text',
		value,
		children: [],
	};

	return {
		construct: 'FieldInline',
		name: 'Greeting',
		children: [expression],
		position,
	};
}

describe('setSectionField', () => {
	it('GIVEN a block field with tags and position WHEN setting a phrasing value THEN it converts in place preserving name, tags, and position', () => {
		const field = makeBlockField();
		const tags = field.tags;
		const position = field.position;

		setSectionField(codec, field, 'plain value');

		expect(field.construct).toBe('FieldInline');
		expect(field.name).toBe('Code Example');
		expect(field.tags).toBe(tags);
		expect(field.position).toBe(position);
		expect(field.children).toHaveLength(1);
		expect(field.children[0]).toMatchObject({
			construct: 'NaturalExpression',
			type: 'text',
			value: 'plain value',
		});
	});

	it('GIVEN an inline field WHEN setting a fenced code value THEN it converts to a block field with the fence intact', () => {
		const field = makeInlineField('Hello');

		setSectionField(codec, field, '```typescript\nconst x = 42;\n```');

		expect(field.construct).toBe('FieldBlock');
		expect(field.name).toBe('Greeting');
		expect(field.position).toEqual(makePosition());
		expect(field.children).toHaveLength(1);
		expect(field.children[0]).toMatchObject({
			construct: 'NaturalBlock',
			type: 'code',
			value: '```typescript\nconst x = 42;\n```',
		});
	});

	it('GIVEN an inline field WHEN setting an empty string THEN the value clears to no children', () => {
		const field = makeInlineField('Hello');

		setSectionField(codec, field, '');

		expect(field.construct).toBe('FieldInline');
		expect(field.children).toEqual([]);
	});

	it('GIVEN a block field WHEN setting an empty array THEN the value clears and converts to inline', () => {
		const field = makeBlockField();

		setSectionField(codec, field, []);

		expect(field.construct).toBe('FieldInline');
		expect(field.name).toBe('Code Example');
		expect(field.children).toEqual([]);
	});

	it('GIVEN an inline field WHEN setting a block construct value THEN the construct installs without re-encoding', () => {
		const field = makeInlineField('Hello');
		const code = makeCodeNaturalBlock();

		setSectionField(codec, field, code);

		expect(field.construct).toBe('FieldBlock');
		expect(field.children).toEqual([code]);
	});
});
