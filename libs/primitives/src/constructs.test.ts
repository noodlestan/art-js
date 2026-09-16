import { describe, expect, it } from 'vitest';

import type { ConstructBase, ContainerConstructBase } from './constructs';

describe('ConstructBase type', () => {
	it('WHEN given a valid construct base accepts', () => {
		const construct: ConstructBase = { construct: 'Test' };
		expect(construct.construct).toBe('Test');
	});
});

describe('ContainerConstructBase type', () => {
	it('WHEN given a valid container construct base accepts', () => {
		const construct: ContainerConstructBase = {
			construct: 'Test',
			children: [{ construct: 'Child' }],
		};
		expect(construct.children).toHaveLength(1);
	});
});
