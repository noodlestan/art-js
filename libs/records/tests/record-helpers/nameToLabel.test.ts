import { describe, expect, it } from 'vitest';

import { isCanonicalFieldName } from '../../src/record/private/isCanonicalFieldName.js';
import { labelToName } from '../../src/record/private/labelToName.js';
import { nameToLabel } from '../../src/record/private/nameToLabel.js';

import {
	EXHAUSTIVE_ALPHABET,
	EXHAUSTIVE_MAX_LENGTH,
	directionBNameCases,
	nameLabelCases,
} from './nameToLabel.fixtures.js';

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

const exhaustiveCanonicalNames = buildExhaustiveNames().filter(isCanonicalFieldName);

describe('nameToLabel', () => {
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
