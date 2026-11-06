export const byLabelDocument = `## Test Record

**Id:** First

**ID:** Second

**Purpose:** Records (#wip)
`;

export const byLabelRecordName = 'Test Record';

// The exact stored labels that resolve to a field, shadowed pair included.
export const byLabelReadHitCases = [
	['Id', 'First'],
	['ID', 'Second'],
	['Purpose', 'Records'],
] as const;

// Addressing is the exact stored label: no conversion, no index fallback.
export const byLabelReadMissCases = ['Missing', 'id', 'purpose', 'Id '] as const;

// Writes throw on a miss and never create a field.
export const byLabelWriteMissCases = [
	['Missing', 'Field not found: Missing'],
	['id', 'Field not found: id'],
	['Id ', 'Field not found: Id '],
] as const;
