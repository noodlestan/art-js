import type { RecordState } from './types.js';

export function makeSectionNameReadOnly(section: RecordState['section']): void {
	const descriptor = Object.getOwnPropertyDescriptor(section, 'name');
	if (descriptor?.configurable === false) {
		return;
	}
	const name = section.name;
	const nameDescriptor = {
		configurable: false,
		enumerable: true,
		writable: false,
		value: name,
	};
	Object.defineProperty(section, 'name', nameDescriptor);
}
