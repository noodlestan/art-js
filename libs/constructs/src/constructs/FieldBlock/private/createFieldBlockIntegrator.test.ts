import { describe, expect, it, vi } from 'vitest';

vi.mock('@art-js/primitives', () => ({
	createParserVisitContext: vi.fn((construct, parentContext, _markdown, onBeforeConstruct) => ({
		construct,
		parent: () => parentContext,
		captureChildConstruct: vi.fn(),
		onBeforeConstruct: vi.fn(c => (onBeforeConstruct ? onBeforeConstruct(c, {}) : {})),
		markdown: '',
	})),
}));

describe('createFieldBlockIntegrator', () => {
	it('returns an integrator that captures the construct and returns a new context', async () => {
		const { createFieldBlockIntegrator } = await import('./createFieldBlockIntegrator');
		const integrator = createFieldBlockIntegrator();
		expect(integrator.integrate).toBeInstanceOf(Function);
		const context = {
			construct: { construct: 'Document', children: [] },
			captureChildConstruct: vi.fn(),
			parent: () => undefined,
			markdown: '',
		} as never;
		const field = { construct: 'FieldBlock', name: 'Test', children: [] };
		const result = integrator.integrate(context, {} as never, field as never);
		expect(result).toBeDefined();
	});
});
