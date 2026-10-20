import { deleteSectionField } from './deleteSectionField.js';
import { getSectionField } from './getSectionField.js';
import { listSectionFieldNames } from './listSectionFieldNames.js';
import { makeSectionNameReadOnly } from './makeSectionNameReadOnly.js';
import { renameSectionField } from './renameSectionField.js';
import { setSectionField } from './setSectionField.js';
import type { ArtRecordCapsule, ArtRecordCapsuleContext } from './types.js';

export function createRecordCapsule(context: ArtRecordCapsuleContext): ArtRecordCapsule {
	let nameIsMutable = context.document === undefined;
	if (!nameIsMutable) {
		makeSectionNameReadOnly(context.section);
	}

	function getName(): string {
		return context.section.name;
	}

	function setName(name: string): void {
		if (!nameIsMutable) {
			throw new Error('An extracted record name is immutable');
		}
		if (name.trim().length === 0) {
			throw new TypeError('Record name must be a non-empty string');
		}
		context.section.name = name;
	}

	function getField(name: string): string | undefined {
		return getSectionField(context.section, name);
	}

	function setField(name: string, value: unknown): void {
		setSectionField(context.section, name, value);
	}

	function renameField(oldName: string, newName: string): void {
		renameSectionField(context.section, oldName, newName);
	}

	function deleteField(name: string): boolean {
		return deleteSectionField(context.section, name);
	}

	function getFieldNames(): string[] {
		return listSectionFieldNames(context.section);
	}

	async function save() {
		if (context.section.name.trim().length === 0) {
			throw new Error('Record name is required before save');
		}
		await context.save();
		nameIsMutable = false;
		makeSectionNameReadOnly(context.section);
	}

	const capsule: ArtRecordCapsule = {
		get section(): ArtRecordCapsule['section'] {
			return context.section as ArtRecordCapsule['section'];
		},
		getName,
		setName,
		getField,
		setField,
		renameField,
		deleteField,
		fieldNames: getFieldNames,
		save,
	};

	return capsule;
}
