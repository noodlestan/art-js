import { createParserVisitContext } from '@art-js/primitives';
import { describe, expect, it, vi } from 'vitest';

import { makeDocumentContext } from '../../../test/helpers/context/makeDocumentContext';

vi.mock('@art-js/primitives', async () => {
	const { makeParserVisitContextMock } =
		await import('../../../test/helpers/primitives/makeParserVisitContextMock');
	return makeParserVisitContextMock({ includeSectionDepth: true });
});

vi.mock('./findTagable', async () => {
	const { makeFindTagableMock } =
		await import('../../../test/helpers/findTagable/makeFindTagableMock');
	return makeFindTagableMock();
});

describe('createSectionBlockIntegrator', () => {
	it('returns an integrator that captures the construct and returns a new context', async () => {
		const { createSectionBlockIntegrator } = await import('./createSectionBlockIntegrator');
		const integrator = createSectionBlockIntegrator();
		expect(integrator.integrate).toBeInstanceOf(Function);
		const context = makeDocumentContext() as never;
		const section = { construct: 'SectionBlock', name: 'Test', children: [] };
		const result = integrator.integrate(
			context,
			{ type: 'heading', depth: 1 } as never,
			section as never,
		);
		expect(result).toBeDefined();
	});

	it('breaks immediately when current context is not a SectionBlock', async () => {
		const { createSectionBlockIntegrator } = await import('./createSectionBlockIntegrator');
		const integrator = createSectionBlockIntegrator();
		const context = makeDocumentContext();
		const section = { construct: 'SectionBlock', name: 'Test', children: [] };
		const result = integrator.integrate(
			context as never,
			{ type: 'heading', depth: 1 } as never,
			section as never,
		);
		expect(result).toBeDefined();
		expect(context.captureChildConstruct).toHaveBeenCalledWith(section);
	});

	it('pops to parent when parent section depth is greater than or equal to heading depth', async () => {
		const { createSectionBlockIntegrator } = await import('./createSectionBlockIntegrator');
		const integrator = createSectionBlockIntegrator();
		const parentContext = makeDocumentContext();
		const context = createParserVisitContext(
			{ construct: 'SectionBlock', depth: 2, children: [] } as never,
			parentContext as never,
		);
		const section = { construct: 'SectionBlock', name: 'Test', children: [] };
		const result = integrator.integrate(
			context as never,
			{ type: 'heading', depth: 1 } as never,
			section as never,
		);
		expect(result).toBeDefined();
		expect(parentContext.captureChildConstruct).toHaveBeenCalledWith(section);
	});

	it('stops popping when parent section depth is less than heading depth', async () => {
		const { createSectionBlockIntegrator } = await import('./createSectionBlockIntegrator');
		const integrator = createSectionBlockIntegrator();
		const context = createParserVisitContext(
			{ construct: 'SectionBlock', depth: 1, children: [] } as never,
			undefined,
		);
		const section = { construct: 'SectionBlock', name: 'Test', children: [] };
		const result = integrator.integrate(
			context as never,
			{ type: 'heading', depth: 2 } as never,
			section as never,
		);
		expect(result).toBeDefined();
		expect(context.captureChildConstruct).toHaveBeenCalledWith(section);
	});

	it('returns the same context when the new context has no onBeforeConstruct hook', async () => {
		const { createSectionBlockIntegrator } = await import('./createSectionBlockIntegrator');
		const integrator = createSectionBlockIntegrator();
		const context = makeDocumentContext() as never;
		const section = { construct: 'SectionBlock', name: 'Test', children: [] };
		const result = integrator.integrate(
			context,
			{ type: 'heading', depth: 1 } as never,
			section as never,
		);
		const after = result.onBeforeConstruct({ construct: 'NaturalBlock', children: [] } as never);
		expect(after).toBe(result);
	});
});
