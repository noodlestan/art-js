import type {
	BlockContent,
	Construct,
	FieldBlock,
	FieldInline,
	NaturalExpression,
} from '@art-md/constructs';

import type { RecordSection } from '../types.js';

export type FieldName = string;

export type SectionField = FieldBlock | FieldInline;

export type SectionFieldForm = 'FieldInline' | 'FieldBlock';

export type FieldIndex = ReadonlyMap<FieldName, SectionField>;

type InlineClassifiedValue = {
	readonly form: 'FieldInline';
	readonly children: NaturalExpression[];
};

type BlockClassifiedValue = {
	readonly form: 'FieldBlock';
	readonly children: BlockContent[];
};

export type ClassifiedSectionFieldValue = InlineClassifiedValue | BlockClassifiedValue;

export type ArtRecordCapsule = {
	readonly section: RecordSection;
	readonly fields: FieldIndex;
	getName(): string;
	setName(name: string): void;
	getField(name: string): string | undefined;
	setField(name: string, value: unknown): void;
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
	deleteField(name: string): boolean;
	fieldNames(): string[];
	save(): Promise<void>;
};
