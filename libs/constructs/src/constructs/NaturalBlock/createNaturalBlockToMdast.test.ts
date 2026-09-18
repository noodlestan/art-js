import { describe, expect, it } from 'vitest';

import { makeNaturalBlockMock, makeTagMock } from '../../test/helpers';

import { createNaturalBlockToMdast } from './createNaturalBlockToMdast';

describe('createNaturalBlockToMdast', () => {
	it('WHEN parsing a text value into a root with paragraph', () => {
		const toMdast = createNaturalBlockToMdast();

		const result = toMdast.toMdast(
			makeNaturalBlockMock({ type: 'text', value: ' Hello world' }) as never,
			[],
		);
		expect(result).toMatchObject({
			type: 'root',
			children: expect.arrayContaining([expect.objectContaining({ type: 'paragraph' })]),
		});
	});

	it('WHEN parsing a code block value', () => {
		const toMdast = createNaturalBlockToMdast();

		const result = toMdast.toMdast(
			makeNaturalBlockMock({
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

	it('WHEN children in a paragraph includes', () => {
		const toMdast = createNaturalBlockToMdast();

		const result = toMdast.toMdast(
			makeNaturalBlockMock({ type: 'paragraph', value: 'Hello' }) as never,
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

	it('WHEN present includes tags in a paragraph', () => {
		const toMdast = createNaturalBlockToMdast();

		const result = toMdast.toMdast(
			makeNaturalBlockMock({
				type: 'paragraph',
				value: 'Hello',
				tags: [makeTagMock()],
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

	it('WHEN paragraph has no children does not include tags', () => {
		const toMdast = createNaturalBlockToMdast();

		const result = toMdast.toMdast(
			makeNaturalBlockMock({
				type: 'paragraph',
				value: 'Hello',
				tags: [makeTagMock()],
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

	it('WHEN paragraph tags are empty does not include tags', () => {
		const toMdast = createNaturalBlockToMdast();

		const result = toMdast.toMdast(
			makeNaturalBlockMock({
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
