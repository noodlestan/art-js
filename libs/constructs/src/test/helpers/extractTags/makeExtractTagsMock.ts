import { vi } from 'vitest';

export const makeExtractTagsMock = (
	tags: unknown[] = [],
	stripped: string = '',
): { extractTags: ReturnType<typeof vi.fn> } => ({
	extractTags: vi.fn(() => ({ tags, stripped })),
});
