import type { Construct, SectionBlock } from '@art-md/constructs';
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
	readonly codec: ArtCodec;
	readonly source: ArtDocumentSource;
	readonly document?: ArtDocument;
	readonly nameIsMutable: boolean;
	readonly save: () => Promise<void>;
};

export type ArtRecord = {
	name: string;
	__section: RecordSection;
	setFieldMarkdown(name: string, markdown: string): void;
	setFieldValue(name: string, value: Construct | readonly Construct[]): void;
	getFieldMarkdown(name: string): string | undefined;
	getFieldText(name: string): string | undefined;
	getFieldValue(name: string): readonly Construct[] | undefined;
	renameField(oldName: string, newName: string): void;
	relabelField(name: string, label: string): void;
	setFieldMarkdownByLabel(label: string, markdown: string): void;
	setFieldValueByLabel(label: string, value: Construct | readonly Construct[]): void;
	getFieldMarkdownByLabel(label: string): string | undefined;
	getFieldTextByLabel(label: string): string | undefined;
	getFieldValueByLabel(label: string): readonly Construct[] | undefined;
	save(): Promise<void>;
	[fieldName: string]: unknown;
};
