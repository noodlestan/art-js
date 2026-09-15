import { describe, expect, it } from 'vitest';

import { makeNaturalBlock } from '../../../test/helpers/naturalBlock/makeNaturalBlock';
import { makeSectionBlock } from '../../../test/helpers/sectionBlock/makeSectionBlock';
import { makeTag } from '../../../test/helpers/tag/makeTag';

import { createSectionBlockFromData } from './createSectionBlockFromData';

describe('createSectionBlockFromData', () => {
	it('creates a SectionBlock from minimal data', () => {
		const result = createSectionBlockFromData({ name: 'Test' });
		expect(result).toEqual(makeSectionBlock());
	});

	it('includes optional properties when provided', () => {
		const result = createSectionBlockFromData({
			name: 'Test',
			kind: 'Module',
			depth: 2,
			children: [makeNaturalBlock() as never],
			tags: [makeTag()],
		});
		expect(result.kind).toBe('Module');
		expect(result.depth).toBe(2);
		expect(result.children).toHaveLength(1);
		expect(result.tags).toHaveLength(1);
	});
});
