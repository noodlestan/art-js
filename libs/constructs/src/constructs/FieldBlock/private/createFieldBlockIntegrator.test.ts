import { parserVisitContextMock } from '@art-js/primitives/src/test/helpers/primitives/parserVisitContextMock';
import { describe, expect, it, vi } from 'vitest';

import { documentContextMock } from '../../../test/helpers/constructs/Document/documentContextMock';
import { makeFieldBlockMock } from '../../../test/helpers/constructs/FieldBlock/makeFieldBlockMock';
import { makeNaturalBlockMock } from '../../../test/helpers/constructs/NaturalBlock/makeNaturalBlockMock';
import { makeSectionBlockMock } from '../../../test/helpers/constructs/SectionBlock/makeSectionBlockMock';

vi.mock('@art-js/primitives', () => {
	return parserVisitContextMock();
});

describe('createFieldBlockIntegrator', () => {
	it('WHEN called returns an integrator that captures the construct and returns a new context', async () => {
		const { createFieldBlockIntegrator } = await import('./createFieldBlockIntegrator');
		const integrator = createFieldBlockIntegrator();

		expect(integrator.integrate).toBeInstanceOf(Function);
		const context = documentContextMock() as never;
		const field = makeFieldBlockMock();
		const result = integrator.integrate(context, {} as never, field as never);
		expect(result).toBeDefined();
	});

	it('FOR non-boundary constructs onBeforeConstruct returns the same context', async () => {
		const { createFieldBlockIntegrator } = await import('./createFieldBlockIntegrator');
		const integrator = createFieldBlockIntegrator();
		const context = documentContextMock() as never;
		const naturalBlock = makeNaturalBlockMock();
		const result = integrator.integrate(context, {} as never, naturalBlock as never);

		const after = result.onBeforeConstruct(naturalBlock as never);

		expect(after).toBe(result);
	});

	it('FOR boundary constructs onBeforeConstruct returns the parent context', async () => {
		const { createFieldBlockIntegrator } = await import('./createFieldBlockIntegrator');
		const integrator = createFieldBlockIntegrator();
		const parentContext = documentContextMock() as never;
		const sectionBlock = makeSectionBlockMock();
		const result = integrator.integrate(parentContext, {} as never, sectionBlock as never);

		const after = result.onBeforeConstruct(sectionBlock as never);

		expect(after).toBe(parentContext);
	});

	it('WHEN document context parent returns undefined', () => {
		const context = documentContextMock();
		expect(context.parent()).toBeUndefined();
	});
});
