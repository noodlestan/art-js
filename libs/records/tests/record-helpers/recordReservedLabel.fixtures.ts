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
