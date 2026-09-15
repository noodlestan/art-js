import { describe, expect, it } from 'vitest';

import { createTagParser } from './createTagParser';

describe('createTagParser', () => {
	it('returns a parser with Tag name and factory', () => {
		const parser = createTagParser();
		expect(parser.name).toBe('Tag');
		expect(parser.factory.fromData({ name: 'test' })).toEqual({
			construct: 'Tag',
			name: 'test',
		});
	});
});
