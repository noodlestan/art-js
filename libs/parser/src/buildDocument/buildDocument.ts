import {
	type BlockContent,
	type Construct,
	type ConstructIntegrator,
	type ConstructParser,
} from '@art-js/constructs';
import { type ArtDocument, type ConstructBase, type ParserVisitContext } from '@art-js/primitives';
import type { RootContent } from 'mdast';
import type { Node } from 'unist';
import { SKIP, visit } from 'unist-util-visit';

import { isBlockType } from '../mdast';
import type { DocumentVisitContext } from '../private';

type HandleResult = {
	constructs: Construct[];
	integrator: ConstructIntegrator | null;
};

export function buildDocument(
	defaultConstruct: ConstructParser<ConstructBase>,
	constructParsers: ConstructParser<ConstructBase>[],
	docContext: DocumentVisitContext,
): ArtDocument {
	let currentContext: ParserVisitContext = docContext;

	function tryConstructs(node: RootContent): HandleResult | null {
		for (let i = 0; i < constructParsers.length; i++) {
			const constructParser = constructParsers[i] as ConstructParser;

			const processor = constructParser.processor;
			const construct = processor?.captureNode(currentContext, node);
			if (construct) {
				const integrator = constructParser.integrator ?? null;
				return {
					constructs: [construct],
					integrator,
				};
			}
		}
		return null;
	}

	function handleNaturalBlock(node: Node): typeof SKIP | undefined {
		if (!defaultConstruct.processor) {
			return SKIP;
		}

		const construct = defaultConstruct.processor.captureNode(currentContext, node) as Construct;
		currentContext = currentContext.onBeforeConstruct(construct);
		currentContext.captureChildConstruct(construct);
		return node.type === 'paragraph' ? undefined : SKIP;
	}

	function integrate(
		node: Node,
		constructs: Construct[],
		integrator: ConstructIntegrator | null,
	): void {
		for (const construct of constructs) {
			currentContext = currentContext.onBeforeConstruct(construct);

			if (integrator) {
				currentContext = integrator.integrate(currentContext, node, construct);
			} else {
				currentContext.captureChildConstruct(construct as BlockContent);
			}
		}
	}

	function visitNode(node: Node): typeof SKIP | undefined {
		if (node.type === 'root') {
			return undefined;
		}

		const result = tryConstructs(node as RootContent);
		if (result) {
			integrate(node, result.constructs, result.integrator);
			return SKIP;
		}

		if (isBlockType(node.type)) {
			return handleNaturalBlock(node);
		}

		return SKIP;
	}

	visit(docContext.source.tree, (node: Node) => visitNode(node));

	return docContext.construct;
}
