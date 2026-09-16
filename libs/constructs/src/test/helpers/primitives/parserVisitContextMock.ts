/**
 * @mocks createParserVisitContext() from `@art-js/primitives`
 */

import { vi } from 'vitest';

export const parserVisitContextMock = (options?: {
	includeSectionDepth?: boolean;
}): {
	createParserVisitContext: ReturnType<typeof vi.fn>;
	sectionDepth?: ReturnType<typeof vi.fn>;
} => ({
	createParserVisitContext: vi.fn((construct, parentContext, _markdown, onBeforeConstruct) => {
		const ctx = {
			construct,
			parent: () => parentContext,
			captureChildConstruct: vi.fn(),
			onBeforeConstruct: vi.fn(c => (onBeforeConstruct ? onBeforeConstruct(c, ctx) : ctx)),
			markdown: '',
		};
		return ctx;
	}),
	...(options?.includeSectionDepth ? { sectionDepth: vi.fn(section => section.depth ?? 1) } : {}),
});
