import { describe, expect, it, vi } from 'vitest';

vi.mock('@art-js/primitives', () => ({
	createParserVisitContext: vi.fn((construct, parentContext) => ({
		construct,
		parent: () => parentContext,
		captureChildConstruct: vi.fn(),
		onBeforeConstruct: vi.fn(() => ({})),
		markdown: '',
	})),
	sectionDepth: vi.fn(section => section.depth ?? 1),
}));

vi.mock('./findTagable', () => ({
	findTagable: vi.fn(ctx => ctx.construct),
}));

describe('createSectionBlockIntegrator', () => {
	it('returns an integrator that captures the construct and returns a new context', async () => {
		const { createSectionBlockIntegrator } = await import('./createSectionBlockIntegrator');
		const integrator = createSectionBlockIntegrator();
		expect(integrator.integrate).toBeInstanceOf(Function);
		const context = {
			construct: { construct: 'Document', children: [] },
			captureChildConstruct: vi.fn(),
			parent: () => undefined,
			markdown: '',
		} as never;
		const section = { construct: 'SectionBlock', name: 'Test', children: [] };
		const result = integrator.integrate(
			context,
			{ type: 'heading', depth: 1 } as never,
			section as never,
		);
		expect(result).toBeDefined();
	});
});
