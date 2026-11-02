import { describe, expect, it } from 'vitest';

import { labelToName } from './labelToName.js';

describe('labelToName', () => {
	it('GIVEN a spaced label THEN words are joined in camel case', () => {
		expect(labelToName('Canonical Name')).toBe('canonicalName');
	});

	it('GIVEN an uppercase run THEN it stays a single word', () => {
		expect(labelToName('IDField')).toBe('idfield');
	});

	it('GIVEN a separator THEN it ends the current word', () => {
		expect(labelToName('user_id')).toBe('userId');
	});

	it('GIVEN a label without word characters THEN it throws', () => {
		expect(() => labelToName('---')).toThrow(TypeError);
	});
});
