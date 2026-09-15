import { createTag } from './createTag';
import type { Tag } from './types';

const TRAILING_TAGS = /^(.*?)((?:\(#[\w-]+\)\s*)+)$/;
const TAG = /\(#([\w-]+)\)/g;

export function extractTags(text: string): { tags: Tag[]; stripped: string } {
	const trimmed = text.trimEnd();
	const match = trimmed.match(TRAILING_TAGS);
	if (!match || !match[1] || !match[2]) {
		return {
			tags: [],
			stripped: text,
		};
	}

	const tags = [...match[2].matchAll(TAG)].map(m => createTag({ name: m[1] ?? '' }));
	return {
		tags,
		stripped: match[1].trimEnd(),
	};
}
