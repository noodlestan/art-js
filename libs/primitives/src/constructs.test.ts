import { describe, expect, it } from 'vitest';

import type { ConstructBase, ContainerConstructBase } from './constructs';

describe('ConstructBase type', () => {
	it('accepts a valid construct base', () => {
		const construct: ConstructBase = { construct: 'Test' };
		expect(construct.construct).toBe('Test');
	});
});

describe('ContainerConstructBase type', () => {
	it('accepts a valid container construct base', () => {
		const construct: ContainerConstructBase = {
			construct: 'Test',
			children: [{ construct: 'Child' }],
		};
		expect(construct.children).toHaveLength(1);
	});
});
