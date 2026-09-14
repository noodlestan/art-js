import { readFileSync } from 'fs';
import { resolve } from 'path';

import type { ArtDocument } from '@art-js/constructs';
import type { FieldBlock } from '@art-js/constructs/src/constructs/FieldBlock/private/types';
import type { NaturalBlock } from '@art-js/constructs/src/constructs/NaturalBlock/private/types';
import type { SectionBlock } from '@art-js/constructs/src/constructs/SectionBlock/private/types';
import { parse } from '@art-js/parser';
import { describe, expect, it } from 'vitest';

import { serialize } from './serializer';

describe('serialize', () => {
	it('serializes a Document with nested SectionBlocks', () => {
		const doc: ArtDocument = {
			construct: 'Document',
			children: [
				{
					construct: 'SectionBlock',
					name: 'Title',
					depth: 1,
					children: [],
				},
			],
		};
		const result = serialize(doc);
		expect(result).toContain('# Title');
	});

	it('serializes a Document with FieldBlocks', () => {
		const doc: ArtDocument = {
			construct: 'Document',
			children: [
				{
					construct: 'SectionBlock',
					name: 'Module',
					depth: 1,
					children: [
						{
							construct: 'FieldBlock' as const,
							name: 'Purpose',
							children: [
								{
									construct: 'NaturalBlock' as const,
									type: 'text',
									value: ' Test purpose',
									children: [],
								},
							],
						} as FieldBlock,
					],
				},
			],
		};
		const result = serialize(doc);
		expect(result).toContain('**Purpose:**');
		expect(result).toContain('Test purpose');
	});

	it('serializes a Document with NaturalBlocks', () => {
		const doc: ArtDocument = {
			construct: 'Document',
			children: [
				{
					construct: 'NaturalBlock',
					type: 'text',
					value: ' Hello world',
					children: [],
				},
			],
		};
		const result = serialize(doc);
		expect(result).toContain('Hello world');
	});

	it('serializes a Document with Tags', () => {
		const doc = {
			construct: 'Document',
			children: [
				{
					construct: 'Tag',
					name: 'READ',
				},
			],
		} as unknown as ArtDocument;
		const result = serialize(doc);
		expect(result).toContain('@READ');
	});

	it('throws on unknown construct', () => {
		const doc = {
			construct: 'Document',
			children: [{ construct: 'UnknownConstruct' }],
		} as unknown as ArtDocument;
		expect(() => serialize(doc)).toThrow('Unknown construct: UnknownConstruct');
	});

	it('roundtrips field-block.md.json fixture', () => {
		const fixturePath = resolve(__dirname, '../test/fixtures/000-hello-world.md.json');
		const artDoc = JSON.parse(readFileSync(fixturePath, 'utf8')) as ArtDocument;
		const result = serialize(artDoc);
		expect(result).toContain('Hello World\n');
	});

	it('serializes nested SectionBlocks without introducing extra blank lines', () => {
		const doc: ArtDocument = {
			construct: 'Document',
			children: [
				{
					construct: 'SectionBlock',
					name: 'Hello World',
					depth: 1,
					children: [
						{
							construct: 'NaturalBlock',
							type: 'text',
							value: '\n\n',
						} as NaturalBlock,
						{
							construct: 'SectionBlock',
							name: 'Details',
							depth: 2,
							children: [],
						} as SectionBlock,
					],
				},
			],
		};

		expect(serialize(doc)).toBe('# Hello World\n\n## Details\n');
	});

	it('roundtrip smoke test: field-block.md parse then serialize', () => {
		const mdPath = resolve(__dirname, '../test/fixtures/000-hello-world.md');
		const markdown = readFileSync(mdPath, 'utf8');
		const doc = parse(markdown);
		const result = serialize(doc);
		expect(result).toContain('Hello World\n');
	});
});
