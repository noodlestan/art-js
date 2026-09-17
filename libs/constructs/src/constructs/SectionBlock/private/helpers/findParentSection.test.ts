import { makeDocumentMock } from '@art-js/primitives/src/test/helpers';
import { describe, expect, it } from 'vitest';

import { makeFieldBlockMock, makeSectionBlockMock } from '../../../../test/helpers';

import { findParentSection } from './findParentSection';

describe('findTagable', () => {
	it('WHEN found in context chain returns the section block', () => {
		const section = makeSectionBlockMock();
		const context = {
			construct: section,
			parent: () => undefined,
		} as never;

		const result = findParentSection(context);

		expect(result).toBe(section);
	});

	it('WHEN no section block is found returns undefined', () => {
		const context = {
			construct: makeDocumentMock(),
			parent: () => undefined,
		} as never;

		const result = findParentSection(context);

		expect(result).toBeUndefined();
	});

	it('WHEN walking up the parent chain', () => {
		const section = makeSectionBlockMock();
		const parent = {
			construct: section,
			parent: () => undefined,
		};
		const context = {
			construct: makeFieldBlockMock(),
			parent: () => parent,
		} as never;

		const result = findParentSection(context);

		expect(result).toBe(section);
	});
});
