import { describe, expect, it } from 'vitest';

import { createNaturalBlockProcessor } from './createNaturalBlockProcessor';

describe('createNaturalBlockProcessor', () => {
	it('returns a processor that captures a node', () => {
		const processor = createNaturalBlockProcessor();
		expect(processor.captureNode).toBeInstanceOf(Function);
	});
});
