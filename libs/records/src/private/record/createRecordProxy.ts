import type { ArtRecord, ArtRecordCapsule } from '../../record/types.js';

function assertFieldName(name: string): void {
	if (name.startsWith('__')) {
		throw new TypeError('Record field names starting with "__" are reserved');
	}
}

function exposedFieldNames(capsule: ArtRecordCapsule): string[] {
	return capsule.fieldNames().filter(name => !name.startsWith('__'));
}

export function createRecordProxy(capsule: ArtRecordCapsule): ArtRecord {
	const target: Record<string, unknown> = Object.create(null) as Record<string, unknown>;
	Object.defineProperties(target, {
		name: {
			configurable: true,
			enumerable: true,
			get: () => capsule.getName(),
			set: (value: unknown) => {
				if (typeof value !== 'string') throw new TypeError('Record name must be a string');
				capsule.setName(value);
			},
		},
		__section: {
			configurable: true,
			enumerable: true,
			get: () => capsule.section,
		},
		renameField: {
			configurable: true,
			value: (oldName: string, newName: string) => capsule.renameField(oldName, newName),
		},
		save: {
			configurable: true,
			value: () => capsule.save(),
		},
	});

	const record = new Proxy(target, {
		get(object, property, receiver) {
			if (typeof property !== 'string' || Reflect.has(object, property)) {
				return Reflect.get(object, property, receiver);
			}
			assertFieldName(property);
			return capsule.getField(property);
		},
		set(object, property, value, receiver) {
			if (typeof property !== 'string' || Reflect.has(object, property)) {
				return Reflect.set(object, property, value, receiver);
			}
			assertFieldName(property);
			capsule.setField(property, value);
			return true;
		},
		deleteProperty(object, property) {
			if (typeof property !== 'string' || Reflect.has(object, property)) return false;
			assertFieldName(property);
			return capsule.deleteField(property);
		},
		has(object, property) {
			if (Reflect.has(object, property)) return true;
			return typeof property === 'string' && exposedFieldNames(capsule).includes(property);
		},
		ownKeys(object) {
			return [...new Set([...Reflect.ownKeys(object), ...exposedFieldNames(capsule)])];
		},
		getOwnPropertyDescriptor(object, property) {
			const descriptor = Reflect.getOwnPropertyDescriptor(object, property);
			if (descriptor !== undefined) return descriptor;
			if (typeof property !== 'string' || !exposedFieldNames(capsule).includes(property)) {
				return undefined;
			}
			return {
				configurable: true,
				enumerable: true,
				writable: true,
				value: capsule.getField(property),
			};
		},
	});

	return record as unknown as ArtRecord;
}
