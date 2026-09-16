import { describe, expect, it, vi } from 'vitest';

import { makeDocumentMock } from '../../test/helpers/document/makeDocumentMock';

import { createParserVisitContext } from './createParserVisitContext';

describe('createParserVisitContext', () => {
	it('GIVEN construct creates a context with the', () => {
		const construct = makeDocumentMock();

		const ctx = createParserVisitContext(construct, undefined, 'markdown');

		expect(ctx.construct).toBe(construct);
		expect(ctx.markdown).toBe('markdown');
		expect(ctx.parent()).toBeUndefined();
	});

	it('WHEN capturing child constructs', () => {
		const construct = makeDocumentMock();

		const ctx = createParserVisitContext(construct, undefined);

		ctx.captureChildConstruct({ construct: 'Child' });
		expect(construct.children).toHaveLength(1);
	});

	it('WHEN provided calls onBeforeConstruct', () => {
		const construct = makeDocumentMock();
		const onBeforeConstruct = vi.fn((_construct, _ctx) => _ctx);
		const ctx = createParserVisitContext(construct, undefined, undefined, onBeforeConstruct);
		const child = { construct: 'Child' };

		const result = ctx.onBeforeConstruct(child);

		expect(onBeforeConstruct).toHaveBeenCalledWith(child, ctx);
		expect(result).toBe(ctx);
	});

	it('WHEN onBeforeConstruct is not provided returns the same context', () => {
		const construct = makeDocumentMock();
		const ctx = createParserVisitContext(construct, undefined);

		const result = ctx.onBeforeConstruct({ construct: 'Child' });

		expect(result).toBe(ctx);
	});

	it('WHEN markdown is not provided falls back to parent context markdown', () => {
		const parentConstruct = makeDocumentMock();
		const parentCtx = createParserVisitContext(parentConstruct, undefined, 'parent-md');
		const childConstruct = { construct: 'Section', children: [] };

		const childCtx = createParserVisitContext(childConstruct, parentCtx);

		expect(childCtx.markdown).toBe('parent-md');
		expect(childCtx.parent()).toBe(parentCtx);
	});

	it('WHEN markdown and parent context are not provided defaults to empty string', () => {
		const construct = makeDocumentMock();

		const ctx = createParserVisitContext(construct, undefined);

		expect(ctx.markdown).toBe('');
	});
});
