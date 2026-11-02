import { describe, expect, it } from 'vitest';

import { nameToLabel } from './nameToLabel.js';

describe('nameToLabel', () => {
	it('GIVEN a camel case name THEN uppercase letters start a word', () => {
		expect(nameToLabel('userId')).toBe('User Id');
	});

	it('GIVEN a digit run THEN it stays inside its word', () => {
		expect(nameToLabel('repo2Branch')).toBe('Repo2 Branch');
	});

	it('GIVEN an uppercase run THEN each letter starts a word', () => {
		expect(nameToLabel('aBC')).toBe('A B C');
	});
});
