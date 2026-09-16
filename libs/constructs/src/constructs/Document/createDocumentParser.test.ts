import { describe, expect, it } from 'vitest';

import { createDocumentParser } from './createDocumentParser';

describe('createDocumentParser', () => {
	it('WHEN called returns a parser with Document name and factory', () => {
		const parser = createDocumentParser();

		expect(parser.name).toBe('Document');
		expect(parser.factory.fromData({ children: [] })).toEqual({
			construct: 'Document',
			children: [],
		});
	});
});
