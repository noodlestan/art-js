import { describe, expect, it } from 'vitest';

import { makeNaturalBlockMock } from '../../../test/helpers/constructs/NaturalBlock/makeNaturalBlockMock';
import { makeSectionBlockMock } from '../../../test/helpers/constructs/SectionBlock/makeSectionBlockMock';
import { makeTagMock } from '../../../test/helpers/constructs/Tag/makeTagMock';

import { createSectionBlockFromData } from './createSectionBlockFromData';

describe('createSectionBlockFromData', () => {
	it('WHEN creating a SectionBlock from minimal data', () => {
		const result = createSectionBlockFromData({ name: 'Test' });
		expect(result).toEqual(makeSectionBlockMock());
	});

	it('WHEN provided includes optional properties', () => {
		const result = createSectionBlockFromData({
			name: 'Test',
			kind: 'Module',
			depth: 2,
			children: [makeNaturalBlockMock() as never],
			tags: [makeTagMock()],
		});
		expect(result.kind).toBe('Module');
		expect(result.depth).toBe(2);
		expect(result.children).toHaveLength(1);
		expect(result.tags).toHaveLength(1);
	});
});
