import type { SectionBlock } from '@art-md/constructs';
import type {
	ArtCodec,
	ArtContentSource,
	ArtDocument,
	ArtDocumentSource,
} from '@art-md/primitives';

export type RecordSection = Omit<SectionBlock, 'name'> & {
	readonly name: string;
};

export interface ArtRecord {
	name: string;
	__section: RecordSection;
	renameField(oldName: string, newName: string): void;
	save(): Promise<void>;
	[fieldName: string]: unknown;
}

export interface ArtRecordCapsuleContext {
	readonly section: SectionBlock;
	readonly source: ArtDocumentSource;
	readonly document?: ArtDocument;
	readonly save: () => Promise<void>;
}

export interface ArtRecordCapsule {
	readonly section: RecordSection;
	getName(): string;
	setName(name: string): void;
	getField(name: string): string | undefined;
	setField(name: string, value: unknown): void;
	renameField(oldName: string, newName: string): void;
	deleteField(name: string): boolean;
	fieldNames(): string[];
	save(): Promise<void>;
}

export type ArtRecordCapsuleFactory = (context: ArtRecordCapsuleContext) => ArtRecordCapsule;

export interface CreateArtRecordOptions {
	codec: ArtCodec;
	contentSource: ArtContentSource;
	capsuleFactory?: ArtRecordCapsuleFactory;
}
