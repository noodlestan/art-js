import { makeDocumentMock } from '@art-js/primitives/src/test/helpers';
import { vi } from 'vitest';

import type { DocumentVisitContext } from '../../../private';

export const createDocumentVisitContextMock = (options?: {
	markdown?: string;
	tree?: unknown;
}): DocumentVisitContext => {
	const markdown = options?.markdown ?? 'Hello world';
	const tree = (options?.tree ?? { type: 'root', children: [] }) as never;
	const construct = makeDocumentMock();
	const context = {
		construct,
		source: { tree, markdown },
		captureChildConstruct: vi.fn(),
		onBeforeConstruct: vi.fn(() => context),
		childContext: vi.fn(() => context),
		parent: vi.fn(() => undefined),
	};
	return context as unknown as DocumentVisitContext;
};
