import { createArtDocument, createArtDocumentSource } from '@art-md/primitives';
import type { ArtDocument, ConstructBase } from '@art-md/primitives';

import { createRecordSection } from './createRecordSection.js';
import type { ArtRecord, RecordContext, RecordHandleContext } from './types.js';
import { wrapSectionAsRecord } from './wrapSectionAsRecord.js';

export function createRecord(context: RecordContext): ArtRecord {
	const source = createArtDocumentSource(context.codec, context.contentSource);
	const section = createRecordSection(1);

	let document: ArtDocument | undefined;
	async function saveDocument(): Promise<void> {
		if (document === undefined) {
			const children: ConstructBase[] = [section];
			const documentOptions = { children };
			document = createArtDocument(documentOptions);
		}
		await source.writeDocument(document);
	}

	const handleContext: RecordHandleContext = {
		section,
		source,
		nameIsMutable: true,
		save: saveDocument,
	};
	const record = wrapSectionAsRecord(handleContext);

	return record;
}
