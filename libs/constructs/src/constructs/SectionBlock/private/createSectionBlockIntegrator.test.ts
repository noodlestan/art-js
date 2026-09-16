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
	it('WHEN called returns an integrator that captures the construct and returns a new context', async () => {
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

	it('WHEN current context is not a SectionBlock breaks immediately', async () => {
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

	it('WHEN parent section depth is greater than or equal to heading depth pops to parent', async () => {
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

	it('WHEN parent section depth is less than heading depth stops popping', async () => {
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

	it('WHEN the new context has no onBeforeConstruct hook returns the same context', async () => {
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
