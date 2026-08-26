import { describe, expect, it } from 'vitest';

import { createSectionBlockToMdast } from './createSectionBlockToMdast';

function stripPositions(node: unknown): unknown {
	if (node === null || typeof node !== 'object') return node;
	if (Array.isArray(node)) return node.map(stripPositions);
	const obj = node as Record<string, unknown>;
	const rest: Record<string, unknown> = {};
	for (const key of Object.keys(obj)) {
		if (key === 'position') continue;
		rest[key] = stripPositions(obj[key]);
	}
	return rest;
}

describe('createSectionBlockToMdast', () => {
	it('converts a SectionBlock to an mdast heading', () => {
		const impl = createSectionBlockToMdast();
		const result = impl.toMdast(
			{ construct: 'SectionBlock', name: 'Module', depth: 1 } as never,
			[],
		);
		expect(stripPositions(result)).toEqual({
			type: 'heading',
			depth: 1,
			children: [{ type: 'text', value: 'Module' }],
		});
	});

	it('defaults depth to 1 when not provided', () => {
		const impl = createSectionBlockToMdast();
		const result = impl.toMdast({ construct: 'SectionBlock', name: 'Section' } as never, []);
		expect(stripPositions(result)).toEqual({
			type: 'heading',
			depth: 1,
			children: [{ type: 'text', value: 'Section' }],
		});
	});

	it('preserves inline formatting in heading names', () => {
		const impl = createSectionBlockToMdast();
		const result = impl.toMdast(
			{ construct: 'SectionBlock', name: 'Hello _World_! How are **you**?', depth: 1 } as never,
			[],
		);
		expect(stripPositions(result)).toEqual({
			type: 'heading',
			depth: 1,
			children: [
				{ type: 'text', value: 'Hello ' },
				{ type: 'emphasis', children: [{ type: 'text', value: 'World' }] },
				{ type: 'text', value: '! How are ' },
				{ type: 'strong', children: [{ type: 'text', value: 'you' }] },
				{ type: 'text', value: '?' },
			],
		});
	});
});
