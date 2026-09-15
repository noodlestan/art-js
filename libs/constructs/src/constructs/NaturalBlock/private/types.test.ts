import { describe, expect, it } from 'vitest';

import { makeNaturalBlock } from '../../../test/helpers/naturalBlock/makeNaturalBlock';

import type { NaturalBlock } from './types';

describe('NaturalBlock type', () => {
	it('accepts a valid NaturalBlock', () => {
		const block: NaturalBlock = makeNaturalBlock();
		expect(block.value).toBe('hello');
	});
});
