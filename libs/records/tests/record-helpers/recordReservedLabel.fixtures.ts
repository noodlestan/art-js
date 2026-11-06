// Labels that convert to a handle-member name — the reachable set of the abort.
export const reservedLabelCases = [
	['Name', 'name'],
	['NAME', 'name'],
	['name', 'name'],
	['Save', 'save'],
	['save', 'save'],
	['SAVE', 'save'],
	['Rename Field', 'renameField'],
	['RenameField', 'renameField'],
	['rename field', 'renameField'],
	['Set Field Markdown', 'setFieldMarkdown'],
	['Set Field Value', 'setFieldValue'],
	['Get Field Markdown', 'getFieldMarkdown'],
	['Get Field Text', 'getFieldText'],
	['Get Field Value', 'getFieldValue'],
	['Relabel Field', 'relabelField'],
	['Set Field Markdown By Label', 'setFieldMarkdownByLabel'],
	['Set Field Value By Label', 'setFieldValueByLabel'],
	['Get Field Markdown By Label', 'getFieldMarkdownByLabel'],
	['Get Field Text By Label', 'getFieldTextByLabel'],
	['Get Field Value By Label', 'getFieldValueByLabel'],
] as const;

// The fourteen labels reachable from a document that abort extraction — the
// original eight plus the six label-repair labels. `__section` is not among
// them: `labelToName` never emits a `__` prefix.
export const reachableCollisionLabels = [
	'Name',
	'Save',
	'Rename Field',
	'Set Field Markdown',
	'Set Field Value',
	'Get Field Markdown',
	'Get Field Text',
	'Get Field Value',
	'Relabel Field',
	'Set Field Markdown By Label',
	'Set Field Value By Label',
	'Get Field Markdown By Label',
	'Get Field Text By Label',
	'Get Field Value By Label',
] as const;

// `__`-prefixed labels are separators to the converter: they register as plain names.
export const nonReservedLabelCases = [
	['__section', 'section'],
	['__foo', 'foo'],
	['__recordField', 'recordField'],
	['Section', 'section'],
] as const;

export const reservedLabelRecordName = 'Test Record';

export const reservedLabelValue = 'Value';
