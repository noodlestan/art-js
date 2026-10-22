import type { SectionBlock } from '@art-md/constructs';
import type {
	ArtCodec,
	ArtContentSource,
	ArtDocument,
	ArtDocumentSource,
} from '@art-md/primitives';

export type RecordSection = Omit<SectionBlock, 'name' | 'depth'> & {
	readonly name: string;
	readonly depth: number;
};

export type RecordContext = {
	codec: ArtCodec;
	contentSource: ArtContentSource;
};

export type RecordHandleContext = {
	readonly section: SectionBlock;
	readonly source: ArtDocumentSource;
	readonly document?: ArtDocument;
	readonly nameIsMutable: boolean;
	readonly save: () => Promise<void>;
};

export type ArtRecord = {
	name: string;
	__section: RecordSection;
	renameField(oldName: string, newName: string): void;
	save(): Promise<void>;
	[fieldName: string]: unknown;
};
