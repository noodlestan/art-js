import type { FieldBlock, NaturalBlock, SectionBlock } from '@art-js/constructs';
import type { ArtDocument } from '@art-js/primitives';
import { describe, expect, it } from 'vitest';

import { serialize } from './serializer';

describe('serialize', () => {
	it('throws on unknown construct', () => {
		const doc = {
			construct: 'Document',
			children: [{ construct: 'UnknownConstruct' }],
		} as unknown as ArtDocument;
		expect(() => serialize(doc)).toThrow('Unknown construct: UnknownConstruct');
	});

	it('serializes a Document with nested SectionBlocks', () => {
		const doc: ArtDocument = {
			construct: 'Document',
			children: [
				{
					construct: 'SectionBlock',
					name: 'Title',
					depth: 1,
					children: [],
				} as SectionBlock,
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
							construct: 'FieldBlock',
							name: 'Purpose',
							children: [
								{
									construct: 'NaturalBlock',
									type: 'text',
									value: ' Test purpose',
									children: [],
								} as NaturalBlock,
							],
						} as FieldBlock,
					],
				} as SectionBlock,
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
				} as NaturalBlock,
			],
		};
		const result = serialize(doc);
		expect(result).toContain('Hello world');
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
				} as SectionBlock,
			],
		};
		const result = serialize(doc);

		expect(result).toBe('# Hello World\n\n## Details\n');
	});
});
