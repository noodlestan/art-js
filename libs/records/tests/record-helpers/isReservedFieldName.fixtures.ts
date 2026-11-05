// Reserved — handle member names and the reserved `__` prefix at several lengths.
export const reservedNameCases: ReadonlyArray<readonly [string]> = [
	['name'],
	['save'],
	['renameField'],
	['__section'],
	['setFieldMarkdown'],
	['setFieldValue'],
	['getFieldMarkdown'],
	['getFieldText'],
	['getFieldValue'],
	['__private'],
	['__'],
	['__a'],
	['__1'],
	['__recordField'],
	['________'],
] as const;

// Not reserved — ordinary field names, a single underscore, and an interior `__`.
export const nonReservedNameCases: ReadonlyArray<readonly [string]> = [
	['userId'],
	['purpose'],
	['brandNew'],
	['owner'],
	['3A33'],
	['_single'],
	['a__b'],
	['Name'],
	['saveOld'],
	['names'],
] as const;

// Canonical AND reserved — only the combination of the two predicates rejects these.
export const canonicalReservedNameCases: ReadonlyArray<readonly [string]> = [
	['name'],
	['save'],
	['renameField'],
	['setFieldMarkdown'],
	['setFieldValue'],
	['getFieldMarkdown'],
	['getFieldText'],
	['getFieldValue'],
] as const;
