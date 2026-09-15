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
});
