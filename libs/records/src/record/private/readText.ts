export function readText(construct: unknown): string {
	if (typeof construct !== 'object' || construct === null) {
		return '';
	}

	if ('value' in construct && typeof construct.value === 'string') {
		return construct.value;
	}

	if ('children' in construct && Array.isArray(construct.children)) {
		const children = construct.children;
		const textValues = children.map(readText);
		return textValues.join('');
	}

	return '';
}
