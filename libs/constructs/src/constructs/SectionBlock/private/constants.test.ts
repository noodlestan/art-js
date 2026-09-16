import { describe, expect, it } from 'vitest';

import { KIND_PATTERN } from './constants';

describe('KIND_PATTERN', () => {
	it('WHEN matching a kind pattern', () => {
		const result = 'Module: Hello'.match(KIND_PATTERN);

		expect(result).toBeTruthy();
		expect(result?.[1]).toBe('Module');
		expect(result?.[2]).toBe('Hello');
	});

	it('WHEN match text without colon does not', () => {
		expect('Hello World'.match(KIND_PATTERN)).toBeFalsy();
	});
});
