import type { RecordHandleContext } from '../../types.js';
import { createFieldIndex } from '../field-index/createFieldIndex.js';
import { listSectionFieldNames } from '../field-index/listSectionFieldNames.js';
import { assertFieldName } from '../field-name/assertFieldName.js';
import { isCanonicalFieldName } from '../field-name/isCanonicalFieldName.js';
import { isReservedFieldName } from '../field-name/isReservedFieldName.js';
import { nameToLabel } from '../field-name/nameToLabel.js';
import { appendSectionField } from '../section-field/appendSectionField.js';
import { deleteSectionField } from '../section-field/deleteSectionField.js';
import { setSectionField } from '../section-field/setSectionField.js';
import type { ArtRecordCapsule, FieldIndex, FieldName } from '../types.js';

import { defineReadOnlyProperty } from './defineReadOnlyProperty.js';

export function createRecordCapsule(context: RecordHandleContext): ArtRecordCapsule {
	defineReadOnlyProperty(context.section, 'depth', context.section.depth);

	let nameIsMutable = context.nameIsMutable;
	if (!nameIsMutable) {
		defineReadOnlyProperty(context.section, 'name', context.section.name);
	}

	let fieldIndex: FieldIndex = createFieldIndex(context.section);

	function rebuildFieldIndex(): void {
		fieldIndex = createFieldIndex(context.section);
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

	function getField(name: FieldName): string | undefined {
		const field = fieldIndex.get(name);
		if (field === undefined) {
			return undefined;
		}

		return context.codec.toText(field);
	}

	function setField(name: FieldName, value: unknown): void {
		const field = fieldIndex.get(name);
		if (field !== undefined) {
			setSectionField(context.codec, field, value);
			return;
		}

		assertFieldName(name);
		appendSectionField(context.codec, context.section, name, value);
		rebuildFieldIndex();
	}

	function renameField(oldName: FieldName, newName: FieldName): void {
		if (isReservedFieldName(oldName)) {
			throw new TypeError(`Reserved record field name: "${oldName}"`);
		}
		if (isReservedFieldName(newName)) {
			throw new TypeError(`Reserved record field name: "${newName}"`);
		}

		const field = fieldIndex.get(oldName);
		if (field === undefined) {
			throw new Error(`Field not found: ${oldName}`);
		}
		if (!isCanonicalFieldName(newName)) {
			throw new TypeError(`Invalid record field name: "${newName}"`);
		}
		if (fieldIndex.has(newName)) {
			throw new TypeError(`Field name already exists: "${newName}"`);
		}

		field.name = nameToLabel(newName);
		rebuildFieldIndex();
	}

	function deleteField(name: FieldName): boolean {
		const field = fieldIndex.get(name);
		if (field === undefined) {
			assertFieldName(name);
			return false;
		}

		deleteSectionField(context.section, field);
		rebuildFieldIndex();
		return true;
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
		defineReadOnlyProperty(context.section, 'name', context.section.name);
	}

	const capsule: ArtRecordCapsule = {
		get section(): ArtRecordCapsule['section'] {
			return context.section as ArtRecordCapsule['section'];
		},
		get fields(): ArtRecordCapsule['fields'] {
			return fieldIndex;
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
