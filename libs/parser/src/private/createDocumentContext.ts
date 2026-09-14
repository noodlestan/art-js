import type { ArtDocument } from '@art-js/constructs';
import { type ParserVisitContext, createParserVisitContext } from '@art-js/primitives';

export function createDocumentContext(document: ArtDocument, markdown: string): ParserVisitContext {
	return createParserVisitContext(document, undefined, markdown);
}
