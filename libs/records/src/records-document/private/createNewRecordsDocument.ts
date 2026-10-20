import type { SectionBlock } from '@art-md/constructs';

import type { ArtRecord } from '../../record/types.js';
import { wrapSectionAsRecord } from '../../record/wrapSectionAsRecord.js';
import type { NewRecordsDocument } from '../types.js';

import { createRecordsDocumentBase } from './createRecordsDocumentBase.js';
import type { RecordsDocumentContext } from './types.js';

export function createNewRecordsDocument(context: RecordsDocumentContext): NewRecordsDocument {
	const recordsDocument = createRecordsDocumentBase(context);

	function addRecord(): ArtRecord {
		const section: SectionBlock = {
			construct: 'SectionBlock',
			name: '',
			children: [],
		};
		context.document.children.push(section);

		const recordContext = {
			section,
			source: context.source,
			save: context.save,
		};
		return wrapSectionAsRecord(recordContext);
	}

	const newRecordsDocument: NewRecordsDocument = {
		...recordsDocument,
		addRecord,
	};

	return newRecordsDocument;
}
