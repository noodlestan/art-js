import { vi } from 'vitest';

export const makeParserVisitContextMock = (): {
	createParserVisitContext: ReturnType<typeof vi.fn>;
} => ({
	createParserVisitContext: vi.fn((construct, parentContext, markdown, onBeforeConstruct) => {
		const ctx = {
			construct,
			parent: () => parentContext,
			captureChildConstruct: vi.fn(),
			onBeforeConstruct: vi.fn(c => (onBeforeConstruct ? onBeforeConstruct(c, ctx) : ctx)),
			markdown: markdown ?? parentContext?.markdown ?? '',
		};
		return ctx;
	}),
});
