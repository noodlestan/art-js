import type { SectionBlock } from '@art-md/constructs';
import { createArtDocument, createArtDocumentSource } from '@art-md/primitives';
import type { ArtDocument } from '@art-md/primitives';

import { createRecordCapsule } from '../private/record/createRecordCapsule.js';
import { createRecordProxy } from '../private/record/createRecordProxy.js';

import type { ArtRecord, CreateArtRecordOptions } from './types.js';

export function createArtRecord(options: CreateArtRecordOptions): ArtRecord {
	const source = createArtDocumentSource(options.codec, options.contentSource);
	const section: SectionBlock = {
		construct: 'SectionBlock',
		name: '',
		children: [],
	};

	let document: ArtDocument | undefined;
	const context = {
		section,
		source,
		document,
		save: async () => {
			document ??= createArtDocument({ children: [section] });
			await source.writeDocument(document);
		},
	};
	const capsule = (options.capsuleFactory ?? createRecordCapsule)(context);
	return createRecordProxy(capsule);
}
