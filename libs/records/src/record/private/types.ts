import type { FieldBlock, FieldInline, SectionBlock } from '@art-md/constructs';
import type { ArtDocument, ArtDocumentSource } from '@art-md/primitives';

type RecordSection = Omit<SectionBlock, 'name'> & {
	readonly name: string;
};

export type ArtRecordCapsuleContext = {
	readonly section: SectionBlock;
	readonly source: ArtDocumentSource;
	readonly document?: ArtDocument;
	readonly save: () => Promise<void>;
};

export type ArtRecordCapsule = {
	readonly section: RecordSection;
	getName(): string;
	setName(name: string): void;
	getField(name: string): string | undefined;
	setField(name: string, value: unknown): void;
	renameField(oldName: string, newName: string): void;
	deleteField(name: string): boolean;
	fieldNames(): string[];
	save(): Promise<void>;
};

export type RecordState = ArtRecordCapsuleContext;

export type SectionField = FieldBlock | FieldInline;
