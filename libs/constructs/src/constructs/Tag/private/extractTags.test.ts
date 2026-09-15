import { describe, expect, it } from 'vitest';

import { extractTags } from './extractTags';

describe('extractTags', () => {
	it('returns empty tags and unmodified text when there are no tags', () => {
		const result = extractTags('Hello there');
		expect(result).toEqual({ tags: [], stripped: 'Hello there' });
	});

	it('extracts a single trailing tag', () => {
		const result = extractTags('Hello there (#friend)');
		expect(result).toEqual({
			tags: [{ construct: 'Tag', name: 'friend' }],
			stripped: 'Hello there',
		});
	});

	it('extracts multiple trailing tags', () => {
		const result = extractTags('Hello there (#friend) (#family)');
		expect(result).toEqual({
			tags: [
				{ construct: 'Tag', name: 'friend' },
				{ construct: 'Tag', name: 'family' },
			],
			stripped: 'Hello there',
		});
	});

	it('returns empty tags and unmodified text when the only tag is in the middle', () => {
		const result = extractTags('Hello (#friend) there');
		expect(result).toEqual({
			tags: [],
			stripped: 'Hello (#friend) there',
		});
	});

	it('extracts only the trailing valid tag, keeping the middle tag in the text', () => {
		const result = extractTags('Hello (#bad) there (#good)');
		expect(result).toEqual({
			tags: [{ construct: 'Tag', name: 'good' }],
			stripped: 'Hello (#bad) there',
		});
	});

	it('ignores whitespace after the last tag and still extracts it', () => {
		const result = extractTags('Hello there (#friend)   ');
		expect(result).toEqual({
			tags: [{ construct: 'Tag', name: 'friend' }],
			stripped: 'Hello there',
		});
	});

	it('returns empty tags and unmodified text when there are no tags but trailing whitespace', () => {
		const result = extractTags('Hello there   ');
		expect(result).toEqual({
			tags: [],
			stripped: 'Hello there   ',
		});
	});

	it('returns empty tags when text is only a tag with no preceding text', () => {
		const result = extractTags('(#tag)');
		expect(result).toEqual({
			tags: [],
			stripped: '(#tag)',
		});
	});

	it('returns empty tags for empty string', () => {
		const result = extractTags('');
		expect(result).toEqual({
			tags: [],
			stripped: '',
		});
	});
});
