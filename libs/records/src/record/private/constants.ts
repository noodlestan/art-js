export const CANONICAL_FIELD_NAME_PATTERN = /^[a-z][a-zA-Z0-9]*$/;

export const WORD_CHARACTER_PATTERN = /[\p{L}\p{M}\p{N}]/u;

export const UPPERCASE_LETTER_PATTERN = /\p{Lu}/u;

export const RESERVED_FIELD_NAME_PREFIX = '__';

// Stored-label gate for `relabelField`: the codec's `FIELD_TEXT_PATTERN`
// (`$ART_MD/libs/constructs/src/parser/fields/constants.ts`) minus its colon —
// letter-led, letters and spaces only, with no leading or trailing whitespace.
export const RECORD_FIELD_LABEL_PATTERN = /^[A-Za-z](?:[A-Za-z ]*[A-Za-z])?$/;

export const RESERVED_FIELD_NAMES: readonly string[] = [
	'name',
	'save',
	'renameField',
	'__section',
	'setFieldMarkdown',
	'setFieldValue',
	'getFieldMarkdown',
	'getFieldText',
	'getFieldValue',
	'relabelField',
	'setFieldMarkdownByLabel',
	'setFieldValueByLabel',
	'getFieldMarkdownByLabel',
	'getFieldTextByLabel',
	'getFieldValueByLabel',
];
