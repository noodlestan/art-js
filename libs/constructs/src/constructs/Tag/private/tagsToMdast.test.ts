import { describe, expect, it, vi } from 'vitest';

vi.mock('./tagToMdast', async () => {
	const { makeTagToMdastMock } =
		await import('../../../test/helpers/tagToMdast/makeTagToMdastMock');
	return makeTagToMdastMock();
});

describe('tagsToMdast', () => {
	it('joins tag values into a text node', async () => {
		const { tagsToMdast } = await import('./tagsToMdast');
		const result = tagsToMdast([
			{ construct: 'Tag', name: 'a' },
			{ construct: 'Tag', name: 'b' },
		]);
		expect(result).toEqual({ type: 'text', value: ' (#a) (#b)' });
	});
});
