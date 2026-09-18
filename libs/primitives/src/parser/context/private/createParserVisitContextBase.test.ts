import { fromMarkdown } from 'mdast-util-from-markdown';
import { describe, expect, it, vi } from 'vitest';

import { makeDocumentMock } from '../../../test/helpers/document/makeDocumentMock';

import { createParserVisitContextBase } from './createParserVisitContextBase';

describe('createParserVisitContext', () => {
	it('GIVEN construct creates a context with the', () => {
		const construct = makeDocumentMock();
		const markdown = 'Hello world';
		const tree = fromMarkdown(markdown);

		const ctx = createParserVisitContextBase({ tree, markdown }, construct, undefined);

		expect(ctx.construct).toBe(construct);
		expect(ctx.source.markdown).toBe(markdown);
		expect(ctx.source.tree).toBe(tree);
		expect(ctx.parent()).toBeUndefined();
	});

	it('WHEN capturing child constructs', () => {
		const construct = makeDocumentMock();
		const markdown = 'Hello world';
		const tree = fromMarkdown(markdown);

		const ctx = createParserVisitContextBase({ tree, markdown }, construct, undefined);

		ctx.captureChildConstruct({ construct: 'Child' });
		expect(construct.children).toHaveLength(1);
	});

	it('WHEN onBeforeConstruct is not provided returns the same context', () => {
		const construct = makeDocumentMock();
		const markdown = 'Hello world';
		const tree = fromMarkdown(markdown);

		const ctx = createParserVisitContextBase({ tree, markdown }, construct, undefined);

		const result = ctx.onBeforeConstruct({ construct: 'Child' });

		expect(result).toBe(ctx);
	});

	it('WHEN provided calls onBeforeConstruct', () => {
		const construct = makeDocumentMock();
		const markdown = 'Hello world';
		const tree = fromMarkdown(markdown);
		const onBeforeConstruct = vi.fn((_construct, _ctx) => _ctx);
		const ctx = createParserVisitContextBase(
			{ tree, markdown },
			construct,
			undefined,
			onBeforeConstruct,
		);
		const child = { construct: 'Child' };

		const result = ctx.onBeforeConstruct(child);

		expect(onBeforeConstruct).toHaveBeenCalledWith(child, ctx);
		expect(result).toBe(ctx);
	});

	it('WHEN markdown is not provided falls back to parent context source', () => {
		const parentConstruct = makeDocumentMock();
		const markdown = 'Hello world';
		const tree = fromMarkdown(markdown);
		const parentCtx = createParserVisitContextBase({ tree, markdown }, parentConstruct, undefined);
		const childConstruct = { construct: 'Section', children: [] };

		const childCtx = createParserVisitContextBase({ tree, markdown }, childConstruct, parentCtx);

		expect(childCtx.parent()).toBe(parentCtx);
		expect(childCtx.source.tree).toEqual(tree);
		expect(childCtx.source.markdown).toBe('Hello world');
	});

	it('WHEN creating a child context returns a context with the parent', () => {
		const construct = makeDocumentMock();
		const markdown = 'Hello world';
		const tree = fromMarkdown(markdown);
		const ctx = createParserVisitContextBase({ tree, markdown }, construct, undefined);
		const childConstruct = { construct: 'Section', children: [] };

		const childCtx = ctx.childContext(childConstruct);

		expect(childCtx.construct).toBe(childConstruct);
		expect(childCtx.parent()).toBe(ctx);
		expect(childCtx.source.tree).toBe(tree);
		expect(childCtx.source.markdown).toBe(markdown);
	});

	it('WHEN creating a child context with onBeforeConstruct calls it', () => {
		const construct = makeDocumentMock();
		const markdown = 'Hello world';
		const tree = fromMarkdown(markdown);
		const ctx = createParserVisitContextBase({ tree, markdown }, construct, undefined);
		const onBeforeConstruct = vi.fn((_construct, _ctx) => _ctx);
		const childConstruct = { construct: 'Section', children: [] };

		const childCtx = ctx.childContext(childConstruct, onBeforeConstruct);

		const result = childCtx.onBeforeConstruct({ construct: 'Child' });

		expect(onBeforeConstruct).toHaveBeenCalled();
		expect(result).toBe(childCtx);
	});
});
