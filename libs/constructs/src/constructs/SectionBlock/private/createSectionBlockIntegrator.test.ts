import { createParserVisitContext } from '@art-js/primitives';
import { describe, expect, it, vi } from 'vitest';

import { documentContextMock } from '../../../test/helpers/constructs/Document/documentContextMock';
import { findTagableMock } from '../../../test/helpers/constructs/SectionBlock/findTagableMock';
import { makeSectionBlockMock } from '../../../test/helpers/constructs/SectionBlock/makeSectionBlockMock';

vi.mock('@art-js/primitives', async () => {
	const { parserVisitContextMock } =
		await import('@art-js/primitives/src/test/helpers/primitives/parserVisitContextMock');
	return parserVisitContextMock({ includeSectionDepth: true });
});

vi.mock('./findTagable', () => {
	return findTagableMock();
});

describe('createSectionBlockIntegrator', () => {
	it('returns an integrator that captures the construct and returns a new context', async () => {
		const { createSectionBlockIntegrator } = await import('./createSectionBlockIntegrator');
		const integrator = createSectionBlockIntegrator();
		expect(integrator.integrate).toBeInstanceOf(Function);
		const context = documentContextMock() as never;
		const section = makeSectionBlockMock();
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
		const context = documentContextMock();
		const section = makeSectionBlockMock();
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
		const parentContext = documentContextMock();
		const context = createParserVisitContext(
			makeSectionBlockMock({ depth: 2 }) as never,
			parentContext as never,
		);
		const section = makeSectionBlockMock();
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
			makeSectionBlockMock({ depth: 1 }) as never,
			undefined,
		);
		const section = makeSectionBlockMock();
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
		const context = documentContextMock() as never;
		const section = makeSectionBlockMock();
		const result = integrator.integrate(
			context,
			{ type: 'heading', depth: 1 } as never,
			section as never,
		);
		const after = result.onBeforeConstruct({ construct: 'NaturalBlock', children: [] } as never);
		expect(after).toBe(result);
	});
});
