import { type VisitContext, createNestedContext } from '@art-js/primitives';

export function createDocumentContext(source: string): VisitContext {
	return createNestedContext('Document', undefined, source);
}
