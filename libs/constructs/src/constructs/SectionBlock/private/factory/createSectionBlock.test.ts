import { describe, expect, it } from 'vitest';

import { makeNaturalBlockMock, makeSectionBlockMock, makeTagMock } from '../../../../test/helpers';

import { createSectionBlock } from './createSectionBlock';

describe('createSectionBlock', () => {
	it('WHEN creating a SectionBlock from minimal data', () => {
		const result = createSectionBlock({ name: 'Test' });
		expect(result).toEqual(makeSectionBlockMock());
	});

	it('WHEN provided includes optional properties', () => {
		const result = createSectionBlock({
			name: 'Test',
			kind: 'Module',
			depth: 2,
			children: [makeNaturalBlockMock()],
			tags: [makeTagMock()],
		});
		expect(result.kind).toBe('Module');
		expect(result.depth).toBe(2);
		expect(result.children).toHaveLength(1);
		expect(result.tags).toHaveLength(1);
	});
});
