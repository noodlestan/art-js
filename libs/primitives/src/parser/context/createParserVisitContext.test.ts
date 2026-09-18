import { fromMarkdown } from 'mdast-util-from-markdown';
import { describe, expect, it } from 'vitest';

import { makeDocumentMock } from '../../test/helpers/document/makeDocumentMock';

import { createParserVisitContext } from './createParserVisitContext';

describe('createParserVisitContext', () => {
	it('creates a context with the construct and source', () => {
		const construct = makeDocumentMock();
		const markdown = 'Hello world';
		const tree = fromMarkdown(markdown);

		const ctx = createParserVisitContext(construct, { tree, markdown });

		expect(ctx.construct).toBe(construct);
		expect(ctx.source.tree).toBe(tree);
		expect(ctx.source.markdown).toBe(markdown);
		expect(ctx.parent()).toBeUndefined();
	});
});
