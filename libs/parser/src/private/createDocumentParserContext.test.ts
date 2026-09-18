import { describe, expect, it } from 'vitest';

import { createDocumentParserContext } from './createDocumentParserContext';

describe('createDocumentParserContext', () => {
	it('WHEN creating a document context', async () => {
		const markdown = '# Hello';

		const result = createDocumentParserContext(markdown);

		expect(result.construct.construct).toBe('Document');
		expect(result.source.markdown).toBe('# Hello');
		expect(result.source.tree.type).toBe('root');
	});
});
