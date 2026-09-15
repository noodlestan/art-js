import { describe, expect, it } from 'vitest';

import { extractTags } from './extractTags';

describe('extractTags', () => {
	it('returns empty tags and unmodified text when there are no tags', () => {
		expect(extractTags('Hello there')).toEqual({ tags: [], stripped: 'Hello there' });
	});

	it('extracts a single trailing tag', () => {
		expect(extractTags('Hello there (#friend)')).toEqual({
			tags: [{ construct: 'Tag', name: 'friend' }],
			stripped: 'Hello there',
		});
	});

	it('extracts multiple trailing tags', () => {
		expect(extractTags('Hello there (#friend) (#family)')).toEqual({
			tags: [
				{ construct: 'Tag', name: 'friend' },
				{ construct: 'Tag', name: 'family' },
			],
			stripped: 'Hello there',
		});
	});

	it('returns empty tags and unmodified text when the only tag is in the middle', () => {
		expect(extractTags('Hello (#friend) there')).toEqual({
			tags: [],
			stripped: 'Hello (#friend) there',
		});
	});

	it('extracts only the trailing valid tag, keeping the middle tag in the text', () => {
		expect(extractTags('Hello (#bad) there (#good)')).toEqual({
			tags: [{ construct: 'Tag', name: 'good' }],
			stripped: 'Hello (#bad) there',
		});
	});

	it('ignores whitespace after the last tag and still extracts it', () => {
		expect(extractTags('Hello there (#friend)   ')).toEqual({
			tags: [{ construct: 'Tag', name: 'friend' }],
			stripped: 'Hello there',
		});
	});

	it('returns empty tags and unmodified text when there are no tags but trailing whitespace', () => {
		expect(extractTags('Hello there   ')).toEqual({
			tags: [],
			stripped: 'Hello there   ',
		});
	});

	it('returns empty tags when text is only a tag with no preceding text', () => {
		expect(extractTags('(#tag)')).toEqual({
			tags: [],
			stripped: '(#tag)',
		});
	});

	it('returns empty tags for empty string', () => {
		expect(extractTags('')).toEqual({
			tags: [],
			stripped: '',
		});
	});
});
