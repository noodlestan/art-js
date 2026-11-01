import { UPPERCASE_LETTER_PATTERN } from './constants.js';
import type { FieldName } from './types.js';

export function nameToLabel(name: FieldName): string {
	const words: string[] = [];
	let currentWord = '';

	for (const character of name) {
		if (UPPERCASE_LETTER_PATTERN.test(character) && currentWord !== '') {
			words.push(currentWord);
			currentWord = '';
		}
		currentWord += character;
	}

	if (currentWord !== '') {
		words.push(currentWord);
	}

	return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
