import { vi } from 'vitest';

import type { ArtDocument } from '../../../constructs/Document/types';
import { makeDocument } from '../document/makeDocument';

export const makeDocumentContext = (): {
	construct: ArtDocument;
	captureChildConstruct: ReturnType<typeof vi.fn>;
	parent: () => undefined;
	markdown: string;
} => ({
	construct: makeDocument(),
	captureChildConstruct: vi.fn(),
	parent: () => undefined,
	markdown: '',
});
