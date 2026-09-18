import { describe, expect, it } from 'vitest';

import {
	makeNaturalBlockFixture,
	makeSectionBlockFixture,
	makeTagFixture,
} from '../../../test/helpers';

import { createSectionBlock } from './createSectionBlock';

describe('createSectionBlock', () => {
	it('WHEN creating a SectionBlock from minimal data', () => {
		const result = createSectionBlock({ name: 'Test' });
		expect(result).toEqual(makeSectionBlockFixture());
	});

	it('WHEN provided includes optional properties', () => {
		const result = createSectionBlock({
			name: 'Test',
			kind: 'Module',
			depth: 2,
			children: [makeNaturalBlockFixture()],
			tags: [makeTagFixture()],
		});
		expect(result.kind).toBe('Module');
		expect(result.depth).toBe(2);
		expect(result.children).toHaveLength(1);
		expect(result.tags).toHaveLength(1);
	});
});
