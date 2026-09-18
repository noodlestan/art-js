import type { ParserVisitContext } from '@art-js/primitives';
import { makeDocumentMock, makeParserVisitContextMock } from '@art-js/primitives/src/test/helpers';
import { describe, expect, it } from 'vitest';

import { makeFieldBlockMock, makeSectionBlockMock } from '../../../../test/helpers';

import { findParentSection } from './findParentSection';

function makeContext(construct: ParserVisitContext['construct'], parent?: ParserVisitContext) {
	return {
		...makeParserVisitContextMock(),
		construct,
		parent: () => parent,
	};
}

describe('findParentSection', () => {
	it('WHEN found in context chain returns the section block', () => {
		const section = makeSectionBlockMock();
		const context = makeContext(section);

		const result = findParentSection(context);

		expect(result).toBe(section);
	});

	it('WHEN no section block is found returns undefined', () => {
		const context = makeContext(makeDocumentMock());

		const result = findParentSection(context);

		expect(result).toBeUndefined();
	});

	it('WHEN walking up the parent chain', () => {
		const section = makeSectionBlockMock();
		const parent = makeContext(section);
		const context = makeContext(makeFieldBlockMock(), parent);

		const result = findParentSection(context);

		expect(result).toBe(section);
	});
});
