import { createArtDocument, createArtDocumentSource } from '@art-md/primitives';
import type { ConstructBase } from '@art-md/primitives';

import { createNewRecordsDocument } from './private/createNewRecordsDocument.js';
import { createRecordsDocumentBase } from './private/createRecordsDocumentBase.js';
import type { RecordsDocumentContext } from './private/types.js';
import type { CreateRecordsDocumentOptions, RecordsDocument } from './types.js';

export function createRecordsDocument<RecordFile>(
	options: CreateRecordsDocumentOptions<RecordFile>,
): RecordsDocument<RecordFile> {
	async function read(file: RecordFile) {
		const contentSource = options.createContentSource(file);
		const source = createArtDocumentSource(options.codec, contentSource);
		const document = await source.readDocument();

		async function saveDocument(): Promise<void> {
			await source.writeDocument(document);
		}

		const context: RecordsDocumentContext = {
			document,
			source,
			save: saveDocument,
		};
		const records = createRecordsDocumentBase(context);

		return records;
	}

	async function create(file: RecordFile) {
		const contentSource = options.createContentSource(file);
		const source = createArtDocumentSource(options.codec, contentSource);
		const children: ConstructBase[] = [];
		const documentData = { children };
		const document = createArtDocument(documentData);

		async function saveDocument(): Promise<void> {
			await source.writeDocument(document);
		}

		const context: RecordsDocumentContext = {
			document,
			source,
			save: saveDocument,
		};
		const records = createNewRecordsDocument(context);

		return records;
	}

	return {
		read,
		create,
	};
}
