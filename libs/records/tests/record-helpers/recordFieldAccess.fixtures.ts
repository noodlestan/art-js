export const accessFields = [
	['Purpose', 'First'],
	['Canonical Name', 'Canonical'],
	['3A33', 'Digit Led'],
] as const;

export const accessRecordName = 'Test Record';

export const readValueCases = [
	['purpose', 'First'],
	['canonicalName', 'Canonical'],
	['3A33', 'Digit Led'],
	['brandNew', undefined],
	['Years active', undefined],
	['CanonicalName', undefined],
] as const;

export const readThrowCases = ['__foo'] as const;

export const writeValueCases = [
	['purpose', 'Updated', 'Purpose'],
	['3A33', 'Updated', '3A33'],
	['brandNew', 'Updated', 'Brand New'],
] as const;

export const writeThrowCases = [
	['__foo', 'Record field names starting with "__" are reserved'],
	['Years active', 'Invalid record field name: "Years active"'],
	['CanonicalName', 'Invalid record field name: "CanonicalName"'],
] as const;

export const deleteTrueCases = ['purpose', '3A33'] as const;

export const deleteFalseCases = ['brandNew'] as const;

export const deleteHandleCases = ['name', 'save', 'renameField', '__section'] as const;

export const deleteThrowCases = [
	['__foo', 'Record field names starting with "__" are reserved'],
	['Years active', 'Invalid record field name: "Years active"'],
] as const;

export const memberTrueCases = [
	'name',
	'save',
	'renameField',
	'__section',
	'purpose',
	'3A33',
] as const;

export const memberFalseCases = ['__foo', 'brandNew', 'Years active', 'CanonicalName'] as const;

export const enumeratedCases = ['purpose', '3A33', 'brandNew'] as const;

export const absentKeyCases = ['__foo', 'Years active', 'CanonicalName'] as const;

export const expectedExposedKeys = ['purpose', 'canonicalName', '3A33'] as const;
