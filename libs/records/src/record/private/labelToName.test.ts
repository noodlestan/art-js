import { describe, expect, it } from 'vitest';

import {
	labelCasingJoiningCases,
	labelNameCases,
	labelNoWordCases,
	labelSeparatorCases,
	labelUppercaseBoundaryCases,
	labelWordCharacterCases,
} from './labelToName.fixtures.js';
import { labelToName } from './labelToName.js';

describe('labelToName', () => {
	it.each(labelNameCases)('WHEN label "%s" provided THEN name is "%s"', (label, expected) => {
		expect(labelToName(label)).toBe(expected);
	});

	it.each(labelWordCharacterCases)(
		'WHEN label "%s" provided THEN name is "%s"',
		(label, expected) => {
			expect(labelToName(label)).toBe(expected);
		},
	);

	it.each(labelSeparatorCases)('WHEN label "%s" provided THEN name is "%s"', (label, expected) => {
		expect(labelToName(label)).toBe(expected);
	});

	it.each(labelUppercaseBoundaryCases)(
		'WHEN label "%s" provided THEN name is "%s"',
		(label, expected) => {
			expect(labelToName(label)).toBe(expected);
		},
	);

	it.each(labelCasingJoiningCases)(
		'WHEN label "%s" provided THEN name is "%s"',
		(label, expected) => {
			expect(labelToName(label)).toBe(expected);
		},
	);

	it.each(labelNoWordCases)('WHEN label "%s" provided THEN a TypeError is thrown', label => {
		expect(() => labelToName(label)).toThrow(TypeError);
	});

	it.each(labelNameCases)(
		'FOR label "%s" provided THEN repeated calls return the same name',
		label => {
			expect(labelToName(label)).toBe(labelToName(label));
		},
	);
});
