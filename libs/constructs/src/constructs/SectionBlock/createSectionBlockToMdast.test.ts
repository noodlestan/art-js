import { describe, expect, it } from 'vitest';

import { makeSectionBlock } from '../../test/helpers/sectionBlock/makeSectionBlock';
import { makeTag } from '../../test/helpers/tag/makeTag';

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
		const result = impl.toMdast(makeSectionBlock({ name: 'Module', depth: 1 }) as never, []);
		expect(stripPositions(result)).toEqual({
			type: 'heading',
			depth: 1,
			children: [{ type: 'text', value: 'Module' }],
		});
	});

	it('defaults depth to 1 when not provided', () => {
		const impl = createSectionBlockToMdast();
		const result = impl.toMdast(makeSectionBlock({ name: 'Section' }) as never, []);
		expect(stripPositions(result)).toEqual({
			type: 'heading',
			depth: 1,
			children: [{ type: 'text', value: 'Section' }],
		});
	});

	it('preserves inline formatting in heading names', () => {
		const impl = createSectionBlockToMdast();
		const result = impl.toMdast(
			makeSectionBlock({ name: 'Hello _World_! How are **you**?', depth: 1 }) as never,
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

	it('includes tags in the heading text when present', () => {
		const impl = createSectionBlockToMdast();
		const result = impl.toMdast(
			makeSectionBlock({ name: 'Hello', depth: 1, tags: [makeTag()] }) as never,
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
