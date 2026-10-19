import type { ArtCodec, ArtContentSource } from '@art-md/primitives';

import type { ArtRecord, ArtRecordCapsuleFactory } from '../record/types.js';

export interface DocumentRecords {
	assertPresence(name: string): Promise<boolean>;
	extract(): Promise<ArtRecord[]>;
	save(): Promise<void>;
}

export interface NewDocumentRecords extends DocumentRecords {
	addRecord(): ArtRecord;
}

export interface ArtDocumentRecords<TFile> {
	read(file: TFile): Promise<DocumentRecords>;
	create(file: TFile): Promise<NewDocumentRecords>;
}

export interface CreateArtDocumentRecordsOptions<TFile> {
	codec: ArtCodec;
	createContentSource(file: TFile): ArtContentSource;
	capsuleFactory?: ArtRecordCapsuleFactory;
}
