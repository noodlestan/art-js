export const renameDocument = `## Test Record

**Purpose:** First

**purpose:** Second

**Canonical Name:** Canonical
`;

export const renameRecordName = 'Test Record';

export const renameRejectionCases = [
	['__missing', 'brandNew', 'Reserved record field name: "__missing"'],
	['purpose', '__secret', 'Reserved record field name: "__secret"'],
	['missing', 'Years active', 'Field not found: missing'],
	['purpose', 'Years active', 'Invalid record field name: "Years active"'],
	['canonicalName', 'purpose', 'Field name already exists: "purpose"'],
] as const;

export const renameDigitLedFields = [
	['Purpose', 'First'],
	['purpose', 'Second'],
	['3A33', 'Digit Led'],
] as const;
