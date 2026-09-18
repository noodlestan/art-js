import { createParserVisitContext } from '@art-js/primitives';
import { makeDocumentMock, makeParserVisitContextMock } from '@art-js/primitives/src/test/helpers';
import type { Heading } from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { describe, expect, it, vi } from 'vitest';

import { makeSectionBlockFixture } from '../../../../../test/helpers';

import { createSectionBlockIntegrator } from './createSectionBlockIntegrator';

function makeHeading(markdown: string): Heading {
	return fromMarkdown(markdown).children[0] as Heading;
}

describe('createSectionBlockIntegrator', () => {
	it('WHEN integrating captures the construct and returns a child context', () => {
		const integrator = createSectionBlockIntegrator();
		const context = makeParserVisitContextMock();
		const nextContext = makeParserVisitContextMock();
		vi.mocked(context.childContext).mockReturnValue(nextContext);
		const section = makeSectionBlockFixture();

		const result = integrator.integrate(context, makeHeading('# Hello'), section);

		expect(context.captureChildConstruct).toHaveBeenCalledWith(section);
		expect(context.childContext).toHaveBeenCalledWith(section);
		expect(result).toBe(nextContext);
	});

	it('WHEN the nearest section is at or below the heading depth pops to its parent', () => {
		const integrator = createSectionBlockIntegrator();
		const documentContext = createParserVisitContext(makeDocumentMock(), {
			markdown: '',
			tree: fromMarkdown(''),
		});
		const capture = vi.spyOn(documentContext, 'captureChildConstruct');
		const sectionContext = documentContext.childContext(makeSectionBlockFixture({ depth: 2 }));
		const context = sectionContext.childContext(makeSectionBlockFixture({ depth: 2 }));
		const section = makeSectionBlockFixture();

		integrator.integrate(context, makeHeading('# Hello'), section);

		expect(capture).toHaveBeenCalledWith(section);
	});

	it('WHEN the nearest section is above the heading depth stops at it', () => {
		const integrator = createSectionBlockIntegrator();
		const documentContext = createParserVisitContext(makeDocumentMock(), {
			markdown: '',
			tree: fromMarkdown(''),
		});
		const context = documentContext.childContext(makeSectionBlockFixture({ depth: 1 }));
		const capture = vi.spyOn(context, 'captureChildConstruct');
		const section = makeSectionBlockFixture();

		integrator.integrate(context, makeHeading('## Hello'), section);

		expect(capture).toHaveBeenCalledWith(section);
	});
});
