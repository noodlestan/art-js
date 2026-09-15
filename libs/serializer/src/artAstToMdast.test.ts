import { describe, expect, it } from 'vitest';

import { artAstToMdast } from './artAstToMdast';

describe('artAstToMdast', () => {
	it('converts a document with a known construct', () => {
		const config = {
			constructs: [
				() => ({
					name: 'Document',
					toMdast: () => ({ type: 'root', children: [] }),
				}),
			],
		};
		const document = { construct: 'Document', children: [] };
		const result = artAstToMdast(config, document as never);
		expect(result).toEqual({ type: 'root', children: [] });
	});

	it('throws on unknown construct', () => {
		const config = {
			constructs: [],
		};
		const document = { construct: 'Document', children: [{ construct: 'Unknown' }] };
		expect(() => artAstToMdast(config, document as never)).toThrow('Unknown construct: Unknown');
	});
});
