import { describe, expect, it } from 'vitest';

import { makeNaturalBlock } from '../../test/helpers/naturalBlock/makeNaturalBlock';
import { makeTag } from '../../test/helpers/tag/makeTag';

import { createNaturalBlockToMdast } from './createNaturalBlockToMdast';

describe('createNaturalBlockToMdast', () => {
	it('parses a text value into a root with paragraph', () => {
		const impl = createNaturalBlockToMdast();
		const result = impl.toMdast(
			makeNaturalBlock({ type: 'text', value: ' Hello world' }) as never,
			[],
		);
		expect(result).toMatchObject({
			type: 'root',
			children: expect.arrayContaining([expect.objectContaining({ type: 'paragraph' })]),
		});
	});

	it('parses a code block value', () => {
		const impl = createNaturalBlockToMdast();
		const result = impl.toMdast(
			makeNaturalBlock({
				type: 'code',
				lang: null,
				meta: null,
				value: '```\nconst x = 1;\n```',
			}) as never,
			[],
		);
		expect(result).toMatchObject({
			type: 'root',
			children: expect.arrayContaining([expect.objectContaining({ type: 'code' })]),
		});
	});

	it('includes children in a paragraph', () => {
		const impl = createNaturalBlockToMdast();
		const result = impl.toMdast(makeNaturalBlock({ type: 'paragraph', value: 'Hello' }) as never, [
			{ type: 'text', value: 'child' } as never,
		]);
		expect(result).toMatchObject({
			type: 'root',
			children: expect.arrayContaining([
				expect.objectContaining({
					type: 'paragraph',
					children: expect.arrayContaining([expect.objectContaining({ value: 'child' })]),
				}),
			]),
		});
	});

	it('includes tags in a paragraph when present', () => {
		const impl = createNaturalBlockToMdast();
		const result = impl.toMdast(
			makeNaturalBlock({
				type: 'paragraph',
				value: 'Hello',
				tags: [makeTag()],
			}) as never,
			[{ type: 'text', value: 'child' } as never],
		);
		expect(result).toMatchObject({
			type: 'root',
			children: expect.arrayContaining([
				expect.objectContaining({
					type: 'paragraph',
					children: expect.arrayContaining([expect.objectContaining({ value: ' (#test)' })]),
				}),
			]),
		});
	});

	it('does not include tags when paragraph has no children', () => {
		const impl = createNaturalBlockToMdast();
		const result = impl.toMdast(
			makeNaturalBlock({
				type: 'paragraph',
				value: 'Hello',
				tags: [makeTag()],
			}) as never,
			[],
		);
		expect(result).toMatchObject({
			type: 'root',
			children: expect.arrayContaining([
				expect.objectContaining({
					type: 'paragraph',
					children: expect.not.arrayContaining([expect.objectContaining({ value: ' (#test)' })]),
				}),
			]),
		});
	});

	it('does not include tags when paragraph tags are empty', () => {
		const impl = createNaturalBlockToMdast();
		const result = impl.toMdast(
			makeNaturalBlock({
				type: 'paragraph',
				value: 'Hello',
				tags: [],
			}) as never,
			[{ type: 'text', value: 'child' } as never],
		);
		expect(result).toMatchObject({
			type: 'root',
			children: expect.arrayContaining([
				expect.objectContaining({
					type: 'paragraph',
					children: expect.arrayContaining([expect.objectContaining({ value: 'child' })]),
				}),
			]),
		});
	});
});
