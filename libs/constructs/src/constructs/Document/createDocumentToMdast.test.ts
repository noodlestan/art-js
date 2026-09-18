import type { Heading, Text } from 'mdast';
import { describe, expect, it } from 'vitest';

import { createDocumentToMdast } from './createDocumentToMdast';

describe('createDocumentToMdast', () => {
	it('WHEN wrapping children in a root node', () => {
		const toMdast = createDocumentToMdast();
		const heading: Heading = {
			type: 'heading',
			depth: 1,
			children: [{ type: 'text', value: 'Hello' } as Text],
		};

		const result = toMdast.toMdast({ construct: 'Document' } as never, [heading]);

		expect(result).toEqual({
			type: 'root',
			children: [heading],
		});
	});
});
