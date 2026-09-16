/**
 * @mocks findTagable() from `@art-js/constructs`
 */

import { vi } from 'vitest';

export const findTagableMock = (): { findTagable: ReturnType<typeof vi.fn> } => ({
	findTagable: vi.fn(ctx => (ctx as { construct: unknown }).construct),
});
