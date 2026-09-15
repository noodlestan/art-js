import { vi } from 'vitest';

export const makeParserVisitContextMock = (options?: {
	includeSectionDepth?: boolean;
}): {
	createParserVisitContext: ReturnType<typeof vi.fn>;
	sectionDepth?: ReturnType<typeof vi.fn>;
} => ({
	createParserVisitContext: vi.fn((construct, parentContext, _markdown, onBeforeConstruct) => ({
		construct,
		parent: () => parentContext,
		captureChildConstruct: vi.fn(),
		onBeforeConstruct: vi.fn(c => (onBeforeConstruct ? onBeforeConstruct(c, {}) : {})),
		markdown: '',
	})),
	...(options?.includeSectionDepth ? { sectionDepth: vi.fn(section => section.depth ?? 1) } : {}),
});
