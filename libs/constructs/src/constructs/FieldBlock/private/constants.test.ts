import { describe, expect, it } from 'vitest';

import { FIELD_TEXT_PATTERN } from './constants';

describe('FIELD_TEXT_PATTERN', () => {
	it('matches a field text pattern', () => {
		expect('Purpose: '.match(FIELD_TEXT_PATTERN)).toBeTruthy();
		expect('My Field: '.match(FIELD_TEXT_PATTERN)).toBeTruthy();
	});

	it('does not match non-field text', () => {
		expect('hello'.match(FIELD_TEXT_PATTERN)).toBeFalsy();
		expect('no colon'.match(FIELD_TEXT_PATTERN)).toBeFalsy();
	});
});
