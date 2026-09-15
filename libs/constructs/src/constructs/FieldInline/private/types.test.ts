import { describe, expect, it } from 'vitest';

import type { FieldInline } from './types';

describe('FieldInline type', () => {
	it('accepts a valid FieldInline', () => {
		const field: FieldInline = { construct: 'FieldInline', name: 'Test', children: [] };
		expect(field.name).toBe('Test');
	});
});
