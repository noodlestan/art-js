import { describe, expect, it } from 'vitest';

import { makeDocument } from '../../../test/helpers/document/makeDocument';
import { makeFieldBlock } from '../../../test/helpers/fieldBlock/makeFieldBlock';
import { makeSectionBlock } from '../../../test/helpers/sectionBlock/makeSectionBlock';

import { findTagable } from './findTagable';

describe('findTagable', () => {
	it('returns the section block when found in context chain', () => {
		const section = makeSectionBlock();
		const context = {
			construct: section,
			parent: () => undefined,
		} as never;
		const result = findTagable(context);
		expect(result).toBe(section);
	});

	it('returns undefined when no section block is found', () => {
		const context = {
			construct: makeDocument(),
			parent: () => undefined,
		} as never;
		const result = findTagable(context);
		expect(result).toBeUndefined();
	});

	it('walks up the parent chain', () => {
		const section = makeSectionBlock();
		const parent = {
			construct: section,
			parent: () => undefined,
		};
		const context = {
			construct: makeFieldBlock(),
			parent: () => parent,
		} as never;
		const result = findTagable(context);
		expect(result).toBe(section);
	});
});
