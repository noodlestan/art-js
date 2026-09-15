import { describe, expect, it } from 'vitest';

import type { ParserConfig } from './types';

describe('ParserConfig type', () => {
	it('accepts a valid parser config shape', () => {
		const config: ParserConfig = {
			defaultConstruct: () => ({
				name: 'NaturalBlock',
				factory: { fromData: () => ({}) as never },
			}),
			constructs: [],
		};
		expect(config.defaultConstruct).toBeInstanceOf(Function);
		expect(config.constructs).toEqual([]);
	});
});
