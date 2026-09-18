import { describe, expect, it, vi } from 'vitest';

import { onBeforeConstruct } from './onBeforeConstruct';

describe('onBeforeConstruct', () => {
	it('FOR a non-boundary construct returns the same context', () => {
		const context = { parent: vi.fn() } as never;

		const result = onBeforeConstruct({ construct: 'NaturalBlock' } as never, context);

		expect(result).toBe(context);
	});

	it('FOR a boundary construct without a parent returns the same context', () => {
		const context = { parent: vi.fn(() => undefined) } as never;

		const result = onBeforeConstruct({ construct: 'FieldBlock' } as never, context);

		expect(result).toBe(context);
	});

	it('FOR a boundary construct with a parent returns the parent context', () => {
		const parent = { construct: 'Document' } as never;
		const context = { parent: vi.fn(() => parent) } as never;

		const result = onBeforeConstruct({ construct: 'SectionBlock' } as never, context);

		expect(result).toBe(parent);
	});
});
