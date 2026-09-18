import { vi } from 'vitest';

import type { ParserVisitContext } from '../../../parser/context/types';
import { makeDocumentMock } from '../document/makeDocumentMock';

export const makeParserVisitContextMock = (options?: {
	markdown?: string;
}): ParserVisitContext => ({
	construct: makeDocumentMock(),
	source: {
		tree: { type: 'root', children: [] } as never,
		markdown: options?.markdown ?? '',
	},
	captureChildConstruct: vi.fn(),
	onBeforeConstruct: vi.fn(),
	childContext: vi.fn(),
	parent: vi.fn(() => undefined),
});
