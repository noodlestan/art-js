import { describe, expect, it, vi } from 'vitest';

import { makeDocument } from '../../test/helpers/document/makeDocument';

import { createParserVisitContext } from './createParserVisitContext';

describe('createParserVisitContext', () => {
	it('creates a context with the given construct', () => {
		const construct = makeDocument();
		const ctx = createParserVisitContext(construct, undefined, 'markdown');
		expect(ctx.construct).toBe(construct);
		expect(ctx.markdown).toBe('markdown');
		expect(ctx.parent()).toBeUndefined();
	});

	it('captures child constructs', () => {
		const construct = makeDocument();
		const ctx = createParserVisitContext(construct, undefined);
		ctx.captureChildConstruct({ construct: 'Child' });
		expect(construct.children).toHaveLength(1);
	});

	it('calls onBeforeConstruct when provided', () => {
		const construct = makeDocument();
		const onBeforeConstruct = vi.fn((_construct, _ctx) => _ctx);
		const ctx = createParserVisitContext(construct, undefined, undefined, onBeforeConstruct);
		const child = { construct: 'Child' };
		const result = ctx.onBeforeConstruct(child);
		expect(onBeforeConstruct).toHaveBeenCalledWith(child, ctx);
		expect(result).toBe(ctx);
	});

	it('returns the same context when onBeforeConstruct is not provided', () => {
		const construct = makeDocument();
		const ctx = createParserVisitContext(construct, undefined);
		const result = ctx.onBeforeConstruct({ construct: 'Child' });
		expect(result).toBe(ctx);
	});

	it('falls back to parent context markdown when markdown is not provided', () => {
		const parentConstruct = makeDocument();
		const parentCtx = createParserVisitContext(parentConstruct, undefined, 'parent-md');
		const childConstruct = { construct: 'Section', children: [] };
		const childCtx = createParserVisitContext(childConstruct, parentCtx);
		expect(childCtx.markdown).toBe('parent-md');
		expect(childCtx.parent()).toBe(parentCtx);
	});

	it('defaults to empty string when markdown and parent context are not provided', () => {
		const construct = makeDocument();
		const ctx = createParserVisitContext(construct, undefined);
		expect(ctx.markdown).toBe('');
	});
});
