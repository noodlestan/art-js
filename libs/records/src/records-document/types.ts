import type { ArtCodec, ArtContentSource } from '@art-md/primitives';

import type { ArtRecord } from '../record/types.js';

export type RecordsDocumentBase = {
	hasRecord(name: string): Promise<boolean>;
	extract(): Promise<ArtRecord[]>;
	save(): Promise<void>;
};

export type NewRecordsDocument = RecordsDocumentBase & {
	addRecord(): ArtRecord;
};

export type RecordsDocument<RecordFile> = {
	read(file: RecordFile): Promise<RecordsDocumentBase>;
	create(file: RecordFile): Promise<NewRecordsDocument>;
};

export type CreateRecordsDocumentOptions<RecordFile> = {
	codec: ArtCodec;
	createContentSource(file: RecordFile): ArtContentSource;
};
