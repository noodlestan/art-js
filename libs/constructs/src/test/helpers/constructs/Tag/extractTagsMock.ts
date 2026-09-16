/**
 * @mocks extractTags() from `@art-js/constructs`
 */

import { vi } from 'vitest';

export const extractTagsMock = (
	tags: unknown[] = [],
	stripped: string = '',
): { extractTags: ReturnType<typeof vi.fn> } => ({
	extractTags: vi.fn(() => ({ tags, stripped })),
});
