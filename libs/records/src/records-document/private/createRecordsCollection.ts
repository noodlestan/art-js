import type { SectionBlock } from '@art-md/constructs';

import { createRecordSection } from '../../record/createRecordSection.js';
import type { ArtRecord, RecordHandleContext } from '../../record/types.js';
import { wrapSectionAsRecord } from '../../record/wrapSectionAsRecord.js';
import type { AddRecordPosition, RecordsDocumentCollection } from '../types.js';

import { collectSectionBlocks } from './collectSectionBlocks.js';
import { resolveRecordPlacement } from './resolveRecordPlacement.js';
import type { RecordsCollectionContext } from './types.js';

export function createRecordsCollection(
	context: RecordsCollectionContext,
): RecordsDocumentCollection {
	function createRecordHandle(section: SectionBlock, nameIsMutable: boolean): ArtRecord {
		const recordContext: RecordHandleContext = {
			section,
			source: context.source,
			document: context.document,
			nameIsMutable,
			save: context.save,
		};
		return wrapSectionAsRecord(recordContext);
	}

	async function hasRecord(name: string): Promise<boolean> {
		const sections = collectSectionBlocks(context.document);
		function hasMatchingName(section: SectionBlock): boolean {
			return section.name === name;
		}
		return sections.some(hasMatchingName);
	}

	async function extract(): Promise<ArtRecord[]> {
		const sections = collectSectionBlocks(context.document);
		function extractSection(section: SectionBlock): ArtRecord {
			return createRecordHandle(section, false);
		}
		const records = sections.map(extractSection);
		return records;
	}

	function addRecord(position?: AddRecordPosition): ArtRecord {
		const placement = resolveRecordPlacement(context.document, position);
		const section = createRecordSection(placement.depth);
		placement.container.children.splice(placement.index, 0, section);
		const record = createRecordHandle(section, true);
		return record;
	}

	const collection: RecordsDocumentCollection = {
		hasRecord,
		extract,
		addRecord,
		save: context.save,
	};
	return collection;
}
