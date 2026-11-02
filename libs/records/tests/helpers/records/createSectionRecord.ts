import { createArtCodec } from '@art-md/codec';
import type { FieldInline, NaturalExpression, SectionBlock } from '@art-md/constructs';

import type { ArtRecord } from '../../../src/index.js';
import { wrapSectionAsRecord } from '../../../src/record/wrapSectionAsRecord.js';

export function makeFieldInline(name: string, value: string): FieldInline {
	const expression: NaturalExpression = {
		construct: 'NaturalExpression',
		type: 'text',
		value,
		children: [],
	};

	return {
		construct: 'FieldInline',
		name,
		children: [expression],
	};
}

/**
 * Wraps a hand-built section as a record.
 *
 * The section and its fields remain hand-built, so digit-led and non-ASCII
 * labels bypass parsing, but field reads and writes go through the supplied
 * codec.
 *
 * @provides a record whose fields are exactly the supplied labels.
 */
export function createSectionRecord(name: string, fields: FieldInline[]): ArtRecord {
	const section: SectionBlock = {
		construct: 'SectionBlock',
		name,
		depth: 1,
		children: fields,
	};

	async function saveSection(): Promise<void> {
		return Promise.resolve();
	}

	return wrapSectionAsRecord({
		section,
		codec: createArtCodec(),
		source: {} as never,
		nameIsMutable: false,
		save: saveSection,
	});
}
