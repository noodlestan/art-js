import { createArtDocument, createArtDocumentSource } from '@art-md/primitives';
import type { ArtDocument, ArtDocumentSource, ConstructBase } from '@art-md/primitives';

import { createRecordsCollection } from './private/createRecordsCollection.js';
import type { RecordsCollectionContext } from './private/types.js';
import type {
	RecordsDocument,
	RecordsDocumentCollection,
	RecordsDocumentContext,
} from './types.js';

export function createRecordsDocument<RecordFile>(
	context: RecordsDocumentContext<RecordFile>,
): RecordsDocument<RecordFile> {
	function createDocumentSource(file: RecordFile): ArtDocumentSource {
		const contentSource = context.createContentSource(file);
		return createArtDocumentSource(context.codec, contentSource);
	}

	function createDocumentCollection(
		document: ArtDocument,
		source: ArtDocumentSource,
	): RecordsDocumentCollection {
		async function saveDocument(): Promise<void> {
			await source.writeDocument(document);
		}
		const collectionContext: RecordsCollectionContext = {
			document,
			source,
			save: saveDocument,
		};
		return createRecordsCollection(collectionContext);
	}

	async function read(file: RecordFile): Promise<RecordsDocumentCollection> {
		const source = createDocumentSource(file);
		const document = await source.readDocument();
		return createDocumentCollection(document, source);
	}

	async function create(file: RecordFile): Promise<RecordsDocumentCollection> {
		const source = createDocumentSource(file);
		const children: ConstructBase[] = [];
		const documentOptions = { children };
		const document = createArtDocument(documentOptions);
		return createDocumentCollection(document, source);
	}

	const recordsDocument: RecordsDocument<RecordFile> = {
		read,
		create,
	};
	return recordsDocument;
}
