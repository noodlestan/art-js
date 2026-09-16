import { makeDocumentMock } from '@art-js/primitives/src/test/helpers/document/makeDocumentMock';
import { describe, expect, it } from 'vitest';

import { makeFieldBlockMock } from '../../../test/helpers/constructs/FieldBlock/makeFieldBlockMock';
import { makeSectionBlockMock } from '../../../test/helpers/constructs/SectionBlock/makeSectionBlockMock';

import { findTagable } from './findTagable';

describe('findTagable', () => {
	it('returns the section block when found in context chain', () => {
		const section = makeSectionBlockMock();
		const context = {
			construct: section,
			parent: () => undefined,
		} as never;
		const result = findTagable(context);
		expect(result).toBe(section);
	});

	it('returns undefined when no section block is found', () => {
		const context = {
			construct: makeDocumentMock(),
			parent: () => undefined,
		} as never;
		const result = findTagable(context);
		expect(result).toBeUndefined();
	});

	it('walks up the parent chain', () => {
		const section = makeSectionBlockMock();
		const parent = {
			construct: section,
			parent: () => undefined,
		};
		const context = {
			construct: makeFieldBlockMock(),
			parent: () => parent,
		} as never;
		const result = findTagable(context);
		expect(result).toBe(section);
	});
});
