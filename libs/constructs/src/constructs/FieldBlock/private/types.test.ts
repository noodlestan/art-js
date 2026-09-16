import { describe, expect, it } from 'vitest';

import { makeFieldBlockMock } from '../../../test/helpers/constructs/FieldBlock/makeFieldBlockMock';

import type { FieldBlock } from './types';

describe('FieldBlock type', () => {
	it('accepts a valid FieldBlock', () => {
		const field: FieldBlock = makeFieldBlockMock();
		expect(field.name).toBe('Test');
	});
});
