import type { ArtRecord } from '../types.js';

import { assertNotReservedFieldName } from './assertNotReservedFieldName.js';
import { getExposedFieldNames } from './getExposedFieldNames.js';
import type { ArtRecordCapsule } from './types.js';

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

	const saveDescriptor = {
		configurable: true,
		value: saveRecord,
	};

	const descriptors = {
		name: nameDescriptor,
		__section: sectionDescriptor,
		renameField: renameFieldDescriptor,
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
