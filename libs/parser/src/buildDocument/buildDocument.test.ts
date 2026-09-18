import type { ConstructIntegrator, ConstructParser, ConstructProcessor } from '@art-js/constructs';
import type { ConstructBase } from '@art-js/primitives';
import { SKIP, visit } from 'unist-util-visit';
import { describe, expect, it, vi } from 'vitest';

import { createDocumentVisitContextMock } from '../test/helpers';

import { buildDocument } from './buildDocument';

vi.mock('unist-util-visit', () => ({
	SKIP: Symbol('skip'),
	visit: vi.fn(),
}));

const visitMock = vi.mocked(visit);

const naturalBlockParser = (
	captureNode: (() => unknown) | undefined = () => null,
): ConstructParser<ConstructBase> => ({
	name: 'NaturalBlock',
	processor: { captureNode: vi.fn(captureNode) as ConstructProcessor['captureNode'] },
	factory: { fromData: () => ({}) as ConstructBase },
});

const matchedParser = (
	captureNode: () => unknown,
	integrator?: ConstructIntegrator,
): ConstructParser<ConstructBase> => ({
	name: 'FieldInline',
	processor: { captureNode: vi.fn(captureNode) as ConstructProcessor['captureNode'] },
	...(integrator ? { integrator } : {}),
	factory: { fromData: () => ({}) as ConstructBase },
});

const visitNodes = (nodes: unknown[]): unknown[] => {
	const returns: unknown[] = [];
	visitMock.mockImplementation((_tree, callback) => {
		const visitNode = callback as (node: unknown) => unknown;
		for (const node of nodes) returns.push(visitNode(node));
	});
	return returns;
};

describe('buildDocument', () => {
	it('returns the document after visiting the tree', () => {
		const docContext = createDocumentVisitContextMock();
		visitNodes([{ type: 'root', children: [] }]);

		const result = buildDocument(naturalBlockParser(), [], docContext);

		expect(result).toBe(docContext.construct);
	});

	it('captures a construct matched by a construct parser', () => {
		const docContext = createDocumentVisitContextMock();
		const construct = { construct: 'FieldInline', name: 'Hello', children: [] };
		const defaultParser = naturalBlockParser();
		const parser = matchedParser(() => construct);
		visitNodes([{ type: 'paragraph', children: [] }]);

		buildDocument(defaultParser, [parser], docContext);

		expect(parser.processor?.captureNode).toHaveBeenCalledWith(docContext, expect.anything());
		expect(docContext.onBeforeConstruct).toHaveBeenCalledWith(construct);
		expect(docContext.captureChildConstruct).toHaveBeenCalledWith(construct);
	});

	it('integrates a matched construct when the parser has an integrator', () => {
		const docContext = createDocumentVisitContextMock();
		const construct = { construct: 'FieldInline', name: 'Hello', children: [] };
		const integrator = { integrate: vi.fn(() => docContext) };
		const defaultParser = naturalBlockParser();
		const parser = matchedParser(() => construct, integrator as never);
		visitNodes([{ type: 'paragraph', children: [] }]);

		buildDocument(defaultParser, [parser], docContext);

		expect(integrator.integrate).toHaveBeenCalledWith(docContext, expect.anything(), construct);
		expect(docContext.captureChildConstruct).not.toHaveBeenCalled();
	});

	it('handles a block node with the default construct', () => {
		const docContext = createDocumentVisitContextMock();
		const construct = { construct: 'NaturalBlock', value: 'item' };
		const defaultParser = naturalBlockParser(() => construct);
		const returns = visitNodes([{ type: 'list', children: [] }]);

		buildDocument(defaultParser, [], docContext);

		expect(defaultParser.processor?.captureNode).toHaveBeenCalled();
		expect(docContext.onBeforeConstruct).toHaveBeenCalledWith(construct);
		expect(docContext.captureChildConstruct).toHaveBeenCalledWith(construct);
		expect(returns[0]).toBe(SKIP);
	});

	it('continues into a paragraph handled by the default construct', () => {
		const docContext = createDocumentVisitContextMock();
		const defaultParser = naturalBlockParser(() => ({ construct: 'NaturalBlock' }));
		const returns = visitNodes([{ type: 'paragraph', children: [] }]);

		buildDocument(defaultParser, [], docContext);

		expect(returns[0]).toBeUndefined();
	});

	it('skips block nodes when the default construct has no processor', () => {
		const docContext = createDocumentVisitContextMock();
		const defaultParser = {
			name: 'NaturalBlock',
			factory: { fromData: () => ({}) as ConstructBase },
		};
		const returns = visitNodes([{ type: 'list', children: [] }]);

		buildDocument(defaultParser as never, [], docContext);

		expect(returns[0]).toBe(SKIP);
	});

	it('returns SKIP for non-block, non-matched nodes', () => {
		const docContext = createDocumentVisitContextMock();
		const defaultParser = naturalBlockParser();
		const returns = visitNodes([{ type: 'text', value: 'x' }]);

		buildDocument(defaultParser, [], docContext);

		expect(returns[0]).toBe(SKIP);
	});
});
