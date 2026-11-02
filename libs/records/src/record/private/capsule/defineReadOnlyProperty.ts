export function defineReadOnlyProperty(target: object, property: string, value: unknown): void {
	const descriptor = Object.getOwnPropertyDescriptor(target, property);
	if (descriptor?.configurable === false) {
		return;
	}
	const readonlyDescriptor = {
		configurable: false,
		enumerable: true,
		writable: false,
		value,
	};
	Object.defineProperty(target, property, readonlyDescriptor);
}
