import type { FieldName } from './types.js';

const WORD_CHARACTER_PATTERN = /[\p{L}\p{M}\p{N}]/u;
const UPPERCASE_LETTER_PATTERN = /\p{Lu}/u;

export function labelToName(label: string): FieldName {
	const words: string[] = [];
	let currentWord = '';

	for (const character of label.trim()) {
		if (!WORD_CHARACTER_PATTERN.test(character)) {
			if (currentWord !== '') {
				words.push(currentWord);
				currentWord = '';
			}
			continue;
		}

		if (
			currentWord !== '' &&
			UPPERCASE_LETTER_PATTERN.test(character) &&
			!UPPERCASE_LETTER_PATTERN.test(currentWord.at(-1) ?? '')
		) {
			words.push(currentWord);
			currentWord = '';
		}

		currentWord += character;
	}

	if (currentWord !== '') {
		words.push(currentWord);
	}

	if (words.length === 0) {
		throw new TypeError('Field label must contain at least one word character');
	}

	function capitalize(word: string): string {
		return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
	}

	return words.map((word, index) => (index === 0 ? word.toLowerCase() : capitalize(word))).join('');
}
