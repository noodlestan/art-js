export const relabelDocument = `## Test Record

**Purpose:** First

**purpose:** Second

**Canonical Name:** Canonical (#tag)
`;

export const relabelRecordName = 'Test Record';

// Every gate of `relabelField`, in the spec's validation-before-mutation order:
// reserved name, absent name, then the three label gates.
export const relabelRejectionCases = [
	['relabelField', 'Relabel Field', 'Reserved record field name: "relabelField"'],
	['missing', 'Missing', 'Field not found: missing'],
	['purpose', '   ', 'Field label must contain at least one word character'],
	['purpose', '3A33', 'Invalid record field label: "3A33"'],
	['purpose', 'Ação', 'Invalid record field label: "Ação"'],
	['purpose', ' Purpose', 'Invalid record field label: " Purpose"'],
	['purpose', 'Purpose ', 'Invalid record field label: "Purpose "'],
	['purpose', 'Canonical Name', 'Field label "Canonical Name" does not match field name "purpose"'],
	['canonicalName', 'Purpose', 'Field label "Purpose" does not match field name "canonicalName"'],
] as const;

// Labels that re-derive the addressed name, so the relabel is accepted.
export const relabelSuccessCases = [
	['canonicalName', 'Canonical name', 'Canonical name'],
	['purpose', 'PURPOSE', 'PURPOSE'],
] as const;
