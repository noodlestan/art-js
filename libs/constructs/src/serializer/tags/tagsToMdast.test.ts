import { describe, expect, it, vi } from 'vitest';

import { tagToMdastMock } from '../../test/helpers';

import { tagsToMdast } from './tagsToMdast';

vi.mock('./tagToMdast', () => {
	return tagToMdastMock();
});

describe('tagsToMdast', () => {
	it('WHEN joining tag values into a text node', async () => {
		const result = tagsToMdast([
			{ construct: 'Tag', name: 'a' },
			{ construct: 'Tag', name: 'b' },
		]);
		expect(result).toEqual({ type: 'text', value: ' (#a) (#b)' });
	});
});
