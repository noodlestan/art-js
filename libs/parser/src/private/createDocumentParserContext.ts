import { createArtDocumentFromNode } from '@art-js/constructs';
import { createParserVisitContext } from '@art-js/primitives';
import { fromMarkdown } from 'mdast-util-from-markdown';

import type { DocumentVisitContext } from './types';
export function createDocumentParserContext(markdown: string): DocumentVisitContext {
	const tree = fromMarkdown(markdown);
	const document = createArtDocumentFromNode(tree);

	const source = {
		tree,
		markdown,
	};

	return createParserVisitContext(document, source) as DocumentVisitContext;
}
