/**
 * @mocks Document context for construct integration tests
 */

import { makeDocumentMock } from '@art-js/primitives/src/test/helpers';
import { vi } from 'vitest';

import type { ArtDocument } from '../../../../constructs/Document/types';

export const documentContextMock = (): {
	construct: ArtDocument;
	captureChildConstruct: ReturnType<typeof vi.fn>;
	parent: () => undefined;
	markdown: string;
} => ({
	construct: makeDocumentMock(),
	captureChildConstruct: vi.fn(),
	parent: () => undefined,
	markdown: '',
});
