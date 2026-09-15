import { describe, expect, it } from 'vitest';

import type {
	ConstructIntegrator,
	ConstructParser,
	ConstructProcessor,
	ConstructSerializer,
} from './types';

describe('construct types', () => {
	it('accepts a valid ConstructProcessor', () => {
		const processor: ConstructProcessor = {
			captureNode: () => null,
		};
		expect(processor.captureNode).toBeInstanceOf(Function);
	});

	it('accepts a valid ConstructIntegrator', () => {
		const integrator: ConstructIntegrator = {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			integrate: (_context, _node, _construct) => _context,
		};
		expect(integrator.integrate).toBeInstanceOf(Function);
	});

	it('accepts a valid ConstructParser', () => {
		const parser: ConstructParser = {
			name: 'Test',
			factory: { fromData: () => ({ construct: 'Test' }) as never },
		};
		expect(parser.name).toBe('Test');
	});

	it('accepts a valid ConstructSerializer', () => {
		const serializer: ConstructSerializer = {
			name: 'Test',
			toMdast: () => ({ type: 'text' }),
		};
		expect(serializer.name).toBe('Test');
	});
});
