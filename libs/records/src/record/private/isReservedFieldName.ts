export function isReservedFieldName(name: string): boolean {
	return name.startsWith('__');
}
