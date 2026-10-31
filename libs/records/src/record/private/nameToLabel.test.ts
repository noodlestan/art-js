import { describe, expect, it } from 'vitest';

import { isCanonicalFieldName } from './isCanonicalFieldName.js';
import { labelToName } from './labelToName.js';
import { directionBNameCases, nameLabelCases } from './nameToLabel.fixtures.js';
import { nameToLabel } from './nameToLabel.js';

const EXHAUSTIVE_ALPHABET: readonly string[] = ['a', 'B', '1'];
const EXHAUSTIVE_MAX_LENGTH = 5;

describe('nameToLabel', () => {
	function buildExhaustiveNames(): string[] {
		const exhaustiveNames: string[] = [];
		let frontierNames = [''];

		for (let round = 0; round <= EXHAUSTIVE_MAX_LENGTH; round += 1) {
			exhaustiveNames.push(...frontierNames);

			const grownNames: string[] = [];
			for (const name of frontierNames) {
				for (const character of EXHAUSTIVE_ALPHABET) {
					grownNames.push(name + character);
				}
			}
			frontierNames = grownNames;
		}

		return exhaustiveNames;
	}

	// Every string up to EXHAUSTIVE_MAX_LENGTH over EXHAUSTIVE_ALPHABET; filtering through
	// isCanonicalFieldName keeps the 3^0 + ... + 3^4 names that start with the lowercase letter.
	const exhaustiveCanonicalNames = buildExhaustiveNames().filter(isCanonicalFieldName);

	it.each(nameLabelCases)('WHEN name "%s" provided THEN label is "%s"', (name, expected) => {
		expect(nameToLabel(name)).toBe(expected);
	});

	it.each(directionBNameCases)(
		'WHEN name "%s" provided THEN direction B restores it via its label',
		name => {
			expect(labelToName(nameToLabel(name))).toBe(name);
		},
	);

	it.each(exhaustiveCanonicalNames)(
		'WHEN name "%s" provided THEN direction B restores it via its label',
		name => {
			expect(labelToName(nameToLabel(name))).toBe(name);
		},
	);
});
