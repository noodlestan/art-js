import { createParserVisitContext, sectionDepth } from '@art-js/primitives';
import type { Heading } from 'mdast';

import type { ConstructHandler } from '../../types';

import { findTagable } from './findTagable';
import type { SectionBlock } from './types';

export function createSectionBlockHandler(): ConstructHandler {
	return {
		handle(construct, node, context) {
			const section = construct as SectionBlock;
			let ctx = context;

			const heading = node as Heading;
			while (ctx.construct.construct === 'SectionBlock') {
				const parentSection = findTagable(ctx) as SectionBlock;
				if (parentSection && sectionDepth(parentSection) >= heading.depth) {
					const p = ctx.parent();
					if (p) {
						ctx = p;
					}
				} else {
					break;
				}
			}

			ctx.captureChildConstruct(section);
			return createParserVisitContext(section, ctx, undefined);
		},
	};
}
