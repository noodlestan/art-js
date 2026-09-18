import type { ArtDocument, ParserVisitContext } from '@art-js/primitives';

export type DocumentVisitContext = ParserVisitContext & {
	construct: ArtDocument;
};
