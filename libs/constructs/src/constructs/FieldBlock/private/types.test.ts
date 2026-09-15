import { describe, expect, it } from 'vitest';

import type { FieldBlock } from './types';

describe('FieldBlock type', () => {
	it('accepts a valid FieldBlock', () => {
		const field: FieldBlock = { construct: 'FieldBlock', name: 'Test', children: [] };
		expect(field.name).toBe('Test');
	});
});
