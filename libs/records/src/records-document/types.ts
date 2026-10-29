import type { ArtCodec, ArtContentSource } from '@art-md/primitives';

import type { ArtRecord } from '../record/types.js';

export type AddRecordPosition =
	| { before: ArtRecord }
	| { after: ArtRecord }
	| { appendTo: ArtRecord }
	| { prependTo: ArtRecord };

export type RecordsDocumentCollection = {
	hasRecord(name: string): Promise<boolean>;
	extract(): Promise<ArtRecord[]>;
	addRecord(position?: AddRecordPosition): ArtRecord;
	save(): Promise<void>;
};

export type RecordsDocument<RecordFile> = {
	read(file: RecordFile): Promise<RecordsDocumentCollection>;
	create(file: RecordFile): Promise<RecordsDocumentCollection>;
};

export type RecordsDocumentContext<RecordFile> = {
	codec: ArtCodec;
	createContentSource(file: RecordFile): ArtContentSource;
};
