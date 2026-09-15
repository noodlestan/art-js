import { describe, expect, it } from 'vitest';

import { FIELD_TEXT_PATTERN } from './constants';

describe('FIELD_TEXT_PATTERN', () => {
	it('matches a field text pattern', () => {
		const resultPurpose = 'Purpose: '.match(FIELD_TEXT_PATTERN);
		const resultMyField = 'My Field: '.match(FIELD_TEXT_PATTERN);
		expect(resultPurpose).toBeTruthy();
		expect(resultMyField).toBeTruthy();
	});

	it('does not match non-field text', () => {
		const resultHello = 'hello'.match(FIELD_TEXT_PATTERN);
		const resultNoColon = 'no colon'.match(FIELD_TEXT_PATTERN);
		expect(resultHello).toBeFalsy();
		expect(resultNoColon).toBeFalsy();
	});
});
