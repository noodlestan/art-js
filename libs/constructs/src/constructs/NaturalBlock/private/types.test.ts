import { describe, expect, it } from 'vitest';

import type { NaturalBlock } from './types';

describe('NaturalBlock type', () => {
	it('accepts a valid NaturalBlock', () => {
		const block: NaturalBlock = {
			construct: 'NaturalBlock',
			value: 'hello',
			children: [],
		};
		expect(block.value).toBe('hello');
	});
});
