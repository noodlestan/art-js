import type { SectionBlock } from '@art-md/constructs';
import { createArtDocument, createArtDocumentSource } from '@art-md/primitives';
import type { ArtDocument } from '@art-md/primitives';

import { collectSectionBlocks } from '../private/document-records/collectSectionBlocks.js';
import { createRecordCapsule } from '../private/record/createRecordCapsule.js';
import { createRecordProxy } from '../private/record/createRecordProxy.js';

import type {
	ArtDocumentRecords,
	CreateArtDocumentRecordsOptions,
	DocumentRecords,
	NewDocumentRecords,
} from './types.js';

function createDocumentRecords(
	document: ArtDocument,
	source: ReturnType<typeof createArtDocumentSource>,
	capsuleFactoryOption: CreateArtDocumentRecordsOptions<unknown>['capsuleFactory'],
): DocumentRecords {
	const capsuleFactory = capsuleFactoryOption ?? createRecordCapsule;
	const save = () => source.writeDocument(document);

	return {
		async assertPresence(name) {
			return collectSectionBlocks(document).some(section => section.name === name);
		},
		async extract() {
			return collectSectionBlocks(document).map(section =>
				createRecordProxy(capsuleFactory({ section, source, document, save })),
			);
		},
		save,
	};
}

function createNewDocumentRecords(
	document: ArtDocument,
	source: ReturnType<typeof createArtDocumentSource>,
	capsuleFactoryOption: CreateArtDocumentRecordsOptions<unknown>['capsuleFactory'],
): NewDocumentRecords {
	const records = createDocumentRecords(document, source, capsuleFactoryOption);
	const capsuleFactory = capsuleFactoryOption ?? createRecordCapsule;
	const save = () => source.writeDocument(document);

	return {
		...records,
		addRecord() {
			const section: SectionBlock = {
				construct: 'SectionBlock' as const,
				name: '',
				children: [],
			};
			document.children.push(section);
			return createRecordProxy(capsuleFactory({ section, source, save }));
		},
	};
}

export function createArtDocumentRecords<TFile>(
	options: CreateArtDocumentRecordsOptions<TFile>,
): ArtDocumentRecords<TFile> {
	return {
		async read(file) {
			const contentSource = options.createContentSource(file);
			const source = createArtDocumentSource(options.codec, contentSource);
			const document = await source.readDocument();
			return createDocumentRecords(document, source, options.capsuleFactory);
		},
		async create(file) {
			const contentSource = options.createContentSource(file);
			const source = createArtDocumentSource(options.codec, contentSource);
			const document = createArtDocument({ children: [] });
			return createNewDocumentRecords(document, source, options.capsuleFactory);
		},
	};
}
