import { vi } from 'vitest';

export const makeTagToMdastMock = (): { tagToMdast: ReturnType<typeof vi.fn> } => ({
	tagToMdast: vi.fn(tag => ({ type: 'text', value: `(#${(tag as { name: string }).name})` })),
});
