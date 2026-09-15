import { vi } from 'vitest';

export const makeDocumentContext = (): {
	construct: { construct: string; children: unknown[] };
	captureChildConstruct: ReturnType<typeof vi.fn>;
	parent: () => undefined;
	markdown: string;
} => ({
	construct: { construct: 'Document', children: [] },
	captureChildConstruct: vi.fn(),
	parent: () => undefined,
	markdown: '',
});
