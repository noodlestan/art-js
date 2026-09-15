import { describe, expect, it } from 'vitest';

import { KIND_PATTERN } from './constants';

describe('KIND_PATTERN', () => {
	it('matches a kind pattern', () => {
		const match = 'Module: Hello'.match(KIND_PATTERN);
		expect(match).toBeTruthy();
		expect(match?.[1]).toBe('Module');
		expect(match?.[2]).toBe('Hello');
	});

	it('does not match text without colon', () => {
		expect('Hello World'.match(KIND_PATTERN)).toBeFalsy();
	});
});
