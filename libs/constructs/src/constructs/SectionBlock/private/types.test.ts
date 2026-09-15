import { describe, expect, it } from 'vitest';

import type { SectionBlock } from './types';

describe('SectionBlock type', () => {
	it('accepts a valid SectionBlock', () => {
		const section: SectionBlock = {
			construct: 'SectionBlock',
			name: 'Test',
			children: [],
		};
		expect(section.name).toBe('Test');
	});
});
