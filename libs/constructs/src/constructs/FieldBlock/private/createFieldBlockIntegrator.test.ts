import { describe, expect, it, vi } from 'vitest';

import { makeDocumentContext } from '../../../test/helpers/context/makeDocumentContext';
import { makeFieldBlock } from '../../../test/helpers/fieldBlock/makeFieldBlock';
import { makeNaturalBlock } from '../../../test/helpers/naturalBlock/makeNaturalBlock';
import { makeSectionBlock } from '../../../test/helpers/sectionBlock/makeSectionBlock';

vi.mock('@art-js/primitives', async () => {
	const { makeParserVisitContextMock } =
		await import('../../../test/helpers/primitives/makeParserVisitContextMock');
	return makeParserVisitContextMock();
});

describe('createFieldBlockIntegrator', () => {
	it('returns an integrator that captures the construct and returns a new context', async () => {
		const { createFieldBlockIntegrator } = await import('./createFieldBlockIntegrator');
		const integrator = createFieldBlockIntegrator();
		expect(integrator.integrate).toBeInstanceOf(Function);
		const context = makeDocumentContext() as never;
		const field = makeFieldBlock();
		const result = integrator.integrate(context, {} as never, field as never);
		expect(result).toBeDefined();
	});

	it('onBeforeConstruct returns the same context for non-boundary constructs', async () => {
		const { createFieldBlockIntegrator } = await import('./createFieldBlockIntegrator');
		const integrator = createFieldBlockIntegrator();
		const context = makeDocumentContext() as never;
		const naturalBlock = makeNaturalBlock();
		const result = integrator.integrate(context, {} as never, naturalBlock as never);
		const after = result.onBeforeConstruct(naturalBlock as never);
		expect(after).toBe(result);
	});

	it('onBeforeConstruct returns the parent context for boundary constructs', async () => {
		const { createFieldBlockIntegrator } = await import('./createFieldBlockIntegrator');
		const integrator = createFieldBlockIntegrator();
		const parentContext = makeDocumentContext() as never;
		const sectionBlock = makeSectionBlock();
		const result = integrator.integrate(parentContext, {} as never, sectionBlock as never);
		const after = result.onBeforeConstruct(sectionBlock as never);
		expect(after).toBe(parentContext);
	});

	it('document context parent returns undefined', () => {
		const context = makeDocumentContext();
		expect(context.parent()).toBeUndefined();
	});
});
