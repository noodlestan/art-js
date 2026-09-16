import { describe, expect, it } from 'vitest';

import { FIELD_TEXT_PATTERN } from './constants';

describe('FIELD_TEXT_PATTERN', () => {
	it('WHEN matching a field text pattern', () => {
		const resultPurpose = 'Purpose: '.match(FIELD_TEXT_PATTERN);

		const resultMyField = 'My Field: '.match(FIELD_TEXT_PATTERN);

		expect(resultPurpose).toBeTruthy();
		expect(resultMyField).toBeTruthy();
	});

	it('WHEN match non-field text does not', () => {
		const resultHello = 'hello'.match(FIELD_TEXT_PATTERN);

		const resultNoColon = 'no colon'.match(FIELD_TEXT_PATTERN);

		expect(resultHello).toBeFalsy();
		expect(resultNoColon).toBeFalsy();
	});
});
