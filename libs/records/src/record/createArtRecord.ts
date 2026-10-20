import type { SectionBlock } from '@art-md/constructs';
import { createArtDocument, createArtDocumentSource } from '@art-md/primitives';
import type { ArtDocument, ConstructBase } from '@art-md/primitives';

import type { ArtRecord, CreateArtRecordOptions, RecordContext } from './types.js';
import { wrapSectionAsRecord } from './wrapSectionAsRecord.js';

export function createArtRecord(options: CreateArtRecordOptions): ArtRecord {
	const source = createArtDocumentSource(options.codec, options.contentSource);
	const section: SectionBlock = {
		construct: 'SectionBlock',
		name: '',
		children: [],
	};

	let document: ArtDocument | undefined;
	async function saveDocument(): Promise<void> {
		if (document === undefined) {
			const children: ConstructBase[] = [section];
			const documentOptions = { children };
			document = createArtDocument(documentOptions);
		}
		await source.writeDocument(document);
	}

	const context: RecordContext = {
		section,
		source,
		save: saveDocument,
	};

	const record = wrapSectionAsRecord(context);

	return record;
}
