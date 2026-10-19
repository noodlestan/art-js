import type {
	ArtRecordCapsule,
	ArtRecordCapsuleContext,
	RecordSection,
} from '../../record/types.js';
import {
	deleteSectionField,
	getSectionField,
	listSectionFieldNames,
	renameSectionField,
	setSectionField,
} from '../fields/sectionFields.js';

import type { RecordState } from './types.js';

function makeSectionNameReadOnly(section: RecordState['section']): void {
	const descriptor = Object.getOwnPropertyDescriptor(section, 'name');
	if (descriptor?.configurable !== false) {
		Object.defineProperty(section, 'name', {
			configurable: false,
			enumerable: true,
			writable: false,
			value: section.name,
		});
	}
}

export function createRecordCapsule(context: ArtRecordCapsuleContext): ArtRecordCapsule {
	let nameIsMutable = context.document === undefined;
	if (!nameIsMutable) makeSectionNameReadOnly(context.section);

	return {
		get section() {
			return context.section as RecordSection;
		},
		getName: () => context.section.name,
		setName(name) {
			if (!nameIsMutable) {
				throw new Error('An extracted record name is immutable');
			}
			if (name.trim().length === 0) throw new TypeError('Record name must be a non-empty string');
			context.section.name = name;
		},
		getField: name => getSectionField(context.section, name),
		setField: (name, value) => setSectionField(context.section, name, value),
		renameField: (oldName, newName) => renameSectionField(context.section, oldName, newName),
		deleteField: name => deleteSectionField(context.section, name),
		fieldNames: () => listSectionFieldNames(context.section),
		async save() {
			if (context.section.name.trim().length === 0) {
				throw new Error('Record name is required before save');
			}
			await context.save();
			nameIsMutable = false;
			makeSectionNameReadOnly(context.section);
		},
	};
}
