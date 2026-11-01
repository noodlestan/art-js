export const CANONICAL_FIELD_NAME_PATTERN = /^[a-z][a-zA-Z0-9]*$/;

export const WORD_CHARACTER_PATTERN = /[\p{L}\p{M}\p{N}]/u;

export const UPPERCASE_LETTER_PATTERN = /\p{Lu}/u;

export const RESERVED_FIELD_NAME_PREFIX = '__';

export const RESERVED_FIELD_NAMES: readonly string[] = ['name', 'save', 'renameField', '__section'];
