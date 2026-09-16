import { describe, expect, it } from 'vitest';

import { makeNaturalBlockMock } from '../../../test/helpers/constructs/NaturalBlock/makeNaturalBlockMock';

import type { NaturalBlock } from './types';

describe('NaturalBlock type', () => {
	it('accepts a valid NaturalBlock', () => {
		const block: NaturalBlock = makeNaturalBlockMock();
		expect(block.value).toBe('hello');
	});
});
