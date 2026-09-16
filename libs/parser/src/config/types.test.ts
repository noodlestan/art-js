import { describe, expect, it } from 'vitest';

import type { ParserConfig } from './types';

describe('ParserConfig type', () => {
	it('WHEN given a valid parser config shape accepts', () => {
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
