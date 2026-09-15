import { vi } from 'vitest';

export const makeFindTagableMock = (): { findTagable: ReturnType<typeof vi.fn> } => ({
	findTagable: vi.fn(ctx => (ctx as { construct: unknown }).construct),
});
