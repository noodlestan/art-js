import { describe, expect, it } from 'vitest';

import { parse } from './index';

describe('parse', () => {
	it('WHEN called with no arguments returns a Document', () => {
		const result = parse();

		expect(result.construct).toBe('Document');
		expect(result.children).toEqual([]);
	});

	it('WHEN called with an empty string returns a Document', () => {
		const result = parse('');

		expect(result.construct).toBe('Document');
		expect(result.children).toEqual([]);
	});

	it('WHEN parsing a heading into a SectionBlock', () => {
		const result = parse('# Hello');

		expect(result.construct).toBe('Document');
		expect(result.children).toHaveLength(1);
		expect(result.children[0]).toMatchObject({
			construct: 'SectionBlock',
			name: 'Hello',
			depth: 1,
		});
	});

	it('WHEN parsing a paragraph into a NaturalBlock', () => {
		const result = parse('Hello world');

		expect(result.construct).toBe('Document');
		expect(result.children).toHaveLength(1);
		expect(result.children[0]).toMatchObject({
			construct: 'NaturalBlock',
			value: 'Hello world',
		});
	});

	it('WHEN parsing a field inline value into a FieldInline', () => {
		const result = parse('**Greeting:** Hello world');

		expect(result.construct).toBe('Document');
		expect(result.children).toHaveLength(1);
		expect(result.children[0]).toMatchObject({
			construct: 'FieldInline',
			name: 'Greeting',
		});
	});

	it('WHEN parsing a field block into a FieldBlock', () => {
		const result = parse('**Purpose:**');

		expect(result.construct).toBe('Document');
		expect(result.children).toHaveLength(1);
		expect(result.children[0]).toMatchObject({
			construct: 'FieldBlock',
			name: 'Purpose',
		});
	});

	it('WHEN parsing a field block with tags', () => {
		const result = parse('**Purpose:** (#tag)');

		expect(result.construct).toBe('Document');
		expect(result.children).toHaveLength(1);
		expect(result.children[0]).toMatchObject({
			construct: 'FieldBlock',
			name: 'Purpose',
		});
		expect((result.children[0] as unknown as { tags: unknown[] }).tags).toHaveLength(1);
	});
});
