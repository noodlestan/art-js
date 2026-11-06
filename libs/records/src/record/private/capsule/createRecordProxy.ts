import type { Construct } from '@art-md/constructs';

import type { ArtRecord } from '../../types.js';
import { getExposedFieldNames } from '../field-index/getExposedFieldNames.js';
import { assertNotReservedFieldName } from '../field-name/assertNotReservedFieldName.js';
import type { ArtRecordCapsule } from '../types.js';

export function createRecordProxy(capsule: ArtRecordCapsule): ArtRecord {
	const target = Object.create(null) as Record<string, unknown>;

	function getName(): string {
		return capsule.getName();
	}

	function setName(value: unknown): void {
		if (typeof value !== 'string') {
			throw new TypeError('Record name must be a string');
		}
		capsule.setName(value);
	}

	function getSection() {
		return capsule.section;
	}

	function renameField(oldName: string, newName: string): void {
		capsule.renameField(oldName, newName);
	}

	function relabelField(name: string, label: string): void {
		capsule.relabelField(name, label);
	}

	function setFieldMarkdown(name: string, markdown: string): void {
		capsule.setFieldMarkdown(name, markdown);
	}

	function setFieldValue(name: string, value: Construct | readonly Construct[]): void {
		capsule.setFieldValue(name, value);
	}

	function getFieldMarkdown(name: string): string | undefined {
		return capsule.getFieldMarkdown(name);
	}

	function getFieldText(name: string): string | undefined {
		return capsule.getFieldText(name);
	}

	function getFieldValue(name: string): readonly Construct[] | undefined {
		return capsule.getFieldValue(name);
	}

	function setFieldMarkdownByLabel(label: string, markdown: string): void {
		capsule.setFieldMarkdownByLabel(label, markdown);
	}

	function setFieldValueByLabel(label: string, value: Construct | readonly Construct[]): void {
		capsule.setFieldValueByLabel(label, value);
	}

	function getFieldMarkdownByLabel(label: string): string | undefined {
		return capsule.getFieldMarkdownByLabel(label);
	}

	function getFieldTextByLabel(label: string): string | undefined {
		return capsule.getFieldTextByLabel(label);
	}

	function getFieldValueByLabel(label: string): readonly Construct[] | undefined {
		return capsule.getFieldValueByLabel(label);
	}

	function saveRecord(): Promise<void> {
		return capsule.save();
	}

	const nameDescriptor = {
		configurable: true,
		enumerable: true,
		get: getName,
		set: setName,
	};

	const sectionDescriptor = {
		configurable: true,
		enumerable: true,
		get: getSection,
	};

	const renameFieldDescriptor = {
		configurable: true,
		value: renameField,
	};

	const relabelFieldDescriptor = {
		configurable: true,
		value: relabelField,
	};

	const setFieldMarkdownDescriptor = {
		configurable: true,
		value: setFieldMarkdown,
	};

	const setFieldValueDescriptor = {
		configurable: true,
		value: setFieldValue,
	};

	const getFieldMarkdownDescriptor = {
		configurable: true,
		value: getFieldMarkdown,
	};

	const getFieldTextDescriptor = {
		configurable: true,
		value: getFieldText,
	};

	const getFieldValueDescriptor = {
		configurable: true,
		value: getFieldValue,
	};

	const setFieldMarkdownByLabelDescriptor = {
		configurable: true,
		value: setFieldMarkdownByLabel,
	};

	const setFieldValueByLabelDescriptor = {
		configurable: true,
		value: setFieldValueByLabel,
	};

	const getFieldMarkdownByLabelDescriptor = {
		configurable: true,
		value: getFieldMarkdownByLabel,
	};

	const getFieldTextByLabelDescriptor = {
		configurable: true,
		value: getFieldTextByLabel,
	};

	const getFieldValueByLabelDescriptor = {
		configurable: true,
		value: getFieldValueByLabel,
	};

	const saveDescriptor = {
		configurable: true,
		value: saveRecord,
	};

	const descriptors = {
		name: nameDescriptor,
		__section: sectionDescriptor,
		renameField: renameFieldDescriptor,
		relabelField: relabelFieldDescriptor,
		setFieldMarkdown: setFieldMarkdownDescriptor,
		setFieldValue: setFieldValueDescriptor,
		getFieldMarkdown: getFieldMarkdownDescriptor,
		getFieldText: getFieldTextDescriptor,
		getFieldValue: getFieldValueDescriptor,
		setFieldMarkdownByLabel: setFieldMarkdownByLabelDescriptor,
		setFieldValueByLabel: setFieldValueByLabelDescriptor,
		getFieldMarkdownByLabel: getFieldMarkdownByLabelDescriptor,
		getFieldTextByLabel: getFieldTextByLabelDescriptor,
		getFieldValueByLabel: getFieldValueByLabelDescriptor,
		save: saveDescriptor,
	};

	Object.defineProperties(target, descriptors);

	const record = new Proxy(target, {
		get(object, property, receiver) {
			if (typeof property !== 'string' || Reflect.has(object, property)) {
				return Reflect.get(object, property, receiver);
			}
			assertNotReservedFieldName(property);
			return capsule.getField(property);
		},
		set(object, property, value, receiver) {
			if (typeof property !== 'string' || Reflect.has(object, property)) {
				return Reflect.set(object, property, value, receiver);
			}
			assertNotReservedFieldName(property);
			capsule.setField(property, value);
			return true;
		},
		deleteProperty(object, property) {
			if (typeof property !== 'string' || Reflect.has(object, property)) {
				return false;
			}
			assertNotReservedFieldName(property);
			return capsule.deleteField(property);
		},
		has(object, property) {
			if (Reflect.has(object, property)) {
				return true;
			}
			if (typeof property !== 'string') {
				return false;
			}
			const exposedFieldNames = getExposedFieldNames(capsule.fields);
			return exposedFieldNames.includes(property);
		},
		ownKeys(object) {
			const objectKeys = Reflect.ownKeys(object);
			const exposedFieldNames = getExposedFieldNames(capsule.fields);
			const allKeys = [...objectKeys, ...exposedFieldNames];
			const uniqueKeys = new Set(allKeys);
			return [...uniqueKeys];
		},
		getOwnPropertyDescriptor(object, property) {
			const descriptor = Reflect.getOwnPropertyDescriptor(object, property);
			if (descriptor !== undefined) {
				return descriptor;
			}
			if (typeof property !== 'string') {
				return undefined;
			}
			const exposedFieldNames = getExposedFieldNames(capsule.fields);
			if (!exposedFieldNames.includes(property)) {
				return undefined;
			}
			const value = capsule.getField(property);
			return {
				configurable: true,
				enumerable: true,
				writable: true,
				value,
			};
		},
	});

	return record as unknown as ArtRecord;
}
