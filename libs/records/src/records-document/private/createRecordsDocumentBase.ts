import type { SectionBlock } from '@art-md/constructs';

import type { ArtRecord } from '../../record/types.js';
import { wrapSectionAsRecord } from '../../record/wrapSectionAsRecord.js';
import type { RecordsDocumentBase } from '../types.js';

import { collectSectionBlocks } from './collectSectionBlocks.js';
import type { RecordsDocumentContext } from './types.js';

export function createRecordsDocumentBase(context: RecordsDocumentContext): RecordsDocumentBase {
	async function hasRecord(name: string): Promise<boolean> {
		const sections = collectSectionBlocks(context.document);
		function hasMatchingName(section: SectionBlock): boolean {
			return section.name === name;
		}
		return sections.some(hasMatchingName);
	}

	async function extract(): Promise<ArtRecord[]> {
		const sections = collectSectionBlocks(context.document);
		function createRecord(section: SectionBlock): ArtRecord {
			const recordContext = {
				section,
				source: context.source,
				document: context.document,
				save: context.save,
			};
			return wrapSectionAsRecord(recordContext);
		}
		return sections.map(createRecord);
	}

	const recordsDocument: RecordsDocumentBase = {
		hasRecord,
		extract,
		save: context.save,
	};

	return recordsDocument;
}
