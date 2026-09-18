import { describe, expect, it } from 'vitest';

import { makeSectionBlockMock, makeTagMock } from '../../test/helpers';

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
	it('WHEN converting a SectionBlock to an mdast heading', () => {
		const toMdast = createSectionBlockToMdast();

		const result = toMdast.toMdast(makeSectionBlockMock({ name: 'Module', depth: 1 }) as never, []);

		expect(stripPositions(result)).toEqual({
			type: 'heading',
			depth: 1,
			children: [{ type: 'text', value: 'Module' }],
		});
	});

	it('WHEN not provided defaults depth to 1', () => {
		const toMdast = createSectionBlockToMdast();

		const result = toMdast.toMdast(makeSectionBlockMock({ name: 'Section' }) as never, []);

		expect(stripPositions(result)).toEqual({
			type: 'heading',
			depth: 1,
			children: [{ type: 'text', value: 'Section' }],
		});
	});

	it('WHEN converting preserves inline formatting in heading names', () => {
		const toMdast = createSectionBlockToMdast();

		const result = toMdast.toMdast(
			makeSectionBlockMock({ name: 'Hello _World_! How are **you**?', depth: 1 }) as never,
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

	it('WHEN present includes tags in the heading text', () => {
		const toMdast = createSectionBlockToMdast();

		const result = toMdast.toMdast(
			makeSectionBlockMock({ name: 'Hello', depth: 1, tags: [makeTagMock()] }) as never,
			[],
		);
		expect(stripPositions(result)).toEqual({
			type: 'heading',
			depth: 1,
			children: [
				{ type: 'text', value: 'Hello' },
				{ type: 'text', value: ' (#test)' },
			],
		});
	});
});
