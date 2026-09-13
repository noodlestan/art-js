import { type ParserVisitContext, createParserVisitContext } from '@art-js/primitives';

export function createDocumentContext(source: string): ParserVisitContext {
	return createParserVisitContext({ construct: 'Document' }, undefined, source);
}
