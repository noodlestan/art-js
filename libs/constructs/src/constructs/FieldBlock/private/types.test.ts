import { describe, expect, it } from 'vitest';

import { makeFieldBlock } from '../../../test/helpers/fieldBlock/makeFieldBlock';

import type { FieldBlock } from './types';

describe('FieldBlock type', () => {
	it('accepts a valid FieldBlock', () => {
		const field: FieldBlock = makeFieldBlock();
		expect(field.name).toBe('Test');
	});
});
