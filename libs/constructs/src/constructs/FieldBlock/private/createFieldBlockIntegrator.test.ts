import { describe, expect, it, vi } from 'vitest';

import { makeDocumentContext } from '../../../test/helpers/context/makeDocumentContext';

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
		const field = { construct: 'FieldBlock', name: 'Test', children: [] };
		const result = integrator.integrate(context, {} as never, field as never);
		expect(result).toBeDefined();
	});
});
