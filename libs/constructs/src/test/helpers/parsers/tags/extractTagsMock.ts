/**
 * @mocks extractTags() from `src/parsers/tags`
 */

import { vi } from 'vitest';

export const extractTagsMock = (
	tags: unknown[] = [],
	stripped: string = '',
): { extractTags: ReturnType<typeof vi.fn> } => ({
	extractTags: vi.fn(() => ({ tags, stripped })),
});
