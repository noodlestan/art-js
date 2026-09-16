import { describe, expect, it, vi } from 'vitest';

import { tagToMdastMock } from '../../../test/helpers/constructs/Tag/tagToMdastMock';

vi.mock('./tagToMdast', () => {
	return tagToMdastMock();
});

describe('tagsToMdast', () => {
	it('WHEN joining tag values into a text node', async () => {
		const { tagsToMdast } = await import('./tagsToMdast');

		const result = tagsToMdast([
			{ construct: 'Tag', name: 'a' },
			{ construct: 'Tag', name: 'b' },
		]);
		expect(result).toEqual({ type: 'text', value: ' (#a) (#b)' });
	});
});
