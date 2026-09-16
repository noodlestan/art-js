import { describe, expect, it } from 'vitest';

import { makeFieldBlockMock } from '../../../test/helpers/constructs/FieldBlock/makeFieldBlockMock';

import type { FieldBlock } from './types';

describe('FieldBlock type', () => {
	it('WHEN given a valid FieldBlock accepts', () => {
		const field: FieldBlock = makeFieldBlockMock();
		expect(field.name).toBe('Test');
	});
});
