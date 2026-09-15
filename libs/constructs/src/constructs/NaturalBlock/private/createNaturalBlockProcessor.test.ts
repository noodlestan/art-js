import { describe, expect, it } from 'vitest';

import { createNaturalBlockProcessor } from './createNaturalBlockProcessor';

describe('createNaturalBlockProcessor', () => {
	it('returns a processor that captures a node', () => {
		const processor = createNaturalBlockProcessor();
		expect(processor.captureNode).toBeInstanceOf(Function);
	});

	it('captures a paragraph node as a NaturalBlock', () => {
		const processor = createNaturalBlockProcessor();
		const paragraph = {
			type: 'paragraph',
			children: [
				{
					type: 'text',
					value: 'hello',
					position: {
						start: { line: 1, column: 1, offset: 0 },
						end: { line: 1, column: 6, offset: 5 },
					},
				},
			],
			position: {
				start: { line: 1, column: 1, offset: 0 },
				end: { line: 1, column: 6, offset: 5 },
			},
		};
		const context = { markdown: 'hello' } as never;
		const result = processor.captureNode(context, paragraph as never);
		expect(result).toMatchObject({ construct: 'NaturalBlock', value: 'hello' });
	});
});
