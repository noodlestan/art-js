import { describe, expect, it } from 'vitest';

import { extractTags } from './extractTags';

describe('extractTags', () => {
	it('WHEN there are no tags returns empty tags and unmodified text', () => {
		const result = extractTags('Hello there');
		expect(result).toEqual({ tags: [], stripped: 'Hello there' });
	});

	it('WHEN extracting a single trailing tag', () => {
		const result = extractTags('Hello there (#friend)');

		expect(result).toEqual({
			tags: [{ construct: 'Tag', name: 'friend' }],
			stripped: 'Hello there',
		});
	});

	it('WHEN extracting multiple trailing tags', () => {
		const result = extractTags('Hello there (#friend) (#family)');

		expect(result).toEqual({
			tags: [
				{ construct: 'Tag', name: 'friend' },
				{ construct: 'Tag', name: 'family' },
			],
			stripped: 'Hello there',
		});
	});

	it('WHEN the only tag is in the middle returns empty tags and unmodified text', () => {
		const result = extractTags('Hello (#friend) there');

		expect(result).toEqual({
			tags: [],
			stripped: 'Hello (#friend) there',
		});
	});

	it('WHEN extracting only the trailing valid tag, keeping the middle tag in the text', () => {
		const result = extractTags('Hello (#bad) there (#good)');

		expect(result).toEqual({
			tags: [{ construct: 'Tag', name: 'good' }],
			stripped: 'Hello (#bad) there',
		});
	});

	it('WHEN whitespace after the last tag and still extracts it ignores', () => {
		const result = extractTags('Hello there (#friend)   ');

		expect(result).toEqual({
			tags: [{ construct: 'Tag', name: 'friend' }],
			stripped: 'Hello there',
		});
	});

	it('WHEN there are no tags but trailing whitespace returns empty tags and unmodified text', () => {
		const result = extractTags('Hello there   ');

		expect(result).toEqual({
			tags: [],
			stripped: 'Hello there   ',
		});
	});

	it('WHEN text is only a tag with no preceding text returns empty tags', () => {
		const result = extractTags('(#tag)');

		expect(result).toEqual({
			tags: [],
			stripped: '(#tag)',
		});
	});

	it('FOR empty string returns empty tags', () => {
		const result = extractTags('');

		expect(result).toEqual({
			tags: [],
			stripped: '',
		});
	});
});
