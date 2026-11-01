import type { FieldBlock, FieldInline } from '@art-md/constructs';

import type { RecordSection } from '../types.js';

export type FieldName = string;

export type SectionField = FieldBlock | FieldInline;

export type FieldIndex = ReadonlyMap<FieldName, SectionField>;

export type ArtRecordCapsule = {
	readonly section: RecordSection;
	readonly fields: FieldIndex;
	getName(): string;
	setName(name: string): void;
	getField(name: string): string | undefined;
	setField(name: string, value: unknown): void;
	renameField(oldName: string, newName: string): void;
	deleteField(name: string): boolean;
	fieldNames(): string[];
	save(): Promise<void>;
};
