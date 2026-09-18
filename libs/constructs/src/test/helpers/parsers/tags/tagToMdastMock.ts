/**
 * @mocks tagToMdast() from `src/serializers/tags`
 */

import { vi } from 'vitest';

export const tagToMdastMock = (): { tagToMdast: ReturnType<typeof vi.fn> } => ({
	tagToMdast: vi.fn(tag => ({ type: 'text', value: `(#${(tag as { name: string }).name})` })),
});
