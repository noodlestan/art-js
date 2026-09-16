import {
	type ArtDocument,
	type BlockContent,
	type Construct,
	type ConstructIntegrator,
	type ConstructParser,
	createArtDocument,
} from '@art-js/constructs';
import { type ParserVisitContext } from '@art-js/primitives';
import { fromMarkdown } from 'mdast-util-from-markdown';
import type { Node } from 'unist';
import { SKIP, visit } from 'unist-util-visit';

import type { ParserConfig } from '../config/types';
import { isBlockType } from '../mdast/isBlockType';
import { createDocumentContext } from '../private/createDocumentContext';

interface HandleResult {
	constructs: Construct[];
	integrator: ConstructIntegrator | null;
}

export function buildDocument(config: ParserConfig, markdown: string): ArtDocument {
	const tree = fromMarkdown(markdown);
	const document = createArtDocument(tree);
	// process.exit();
	const docContext = createDocumentContext(document, markdown);
	const defaultConstruct = config.defaultConstruct();
	const constructParsers = [defaultConstruct, ...config.constructs.map(create => create())];
	let currentContext: ParserVisitContext = docContext;

	function tryConstructs(node: Node): HandleResult | null {
		if (node.type === 'root') {
			return null;
		}

		for (let i = 0; i < constructParsers.length; i++) {
			const constructParser = constructParsers[i] as ConstructParser;
			if (i === 0) continue; // default construct handled in handleNaturalBlock

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

	function dispatch(
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

		const result = tryConstructs(node);
		if (result) {
			dispatch(node, result.constructs, result.integrator);
			return SKIP;
		}

		if (isBlockType(node.type)) {
			return handleNaturalBlock(node);
		}

		return SKIP;
	}

	visit(tree, (n: Node) => visitNode(n));

	return document;
}
