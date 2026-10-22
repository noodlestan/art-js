import type { FieldBlock, FieldInline } from '@art-md/constructs';

import type { RecordSection } from '../types.js';

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

export type SectionField = FieldBlock | FieldInline;
