import {
	type ArtDocument,
	type BlockContent,
	type Construct,
	type ConstructHandler,
	type ConstructParser,
	createDocument,
} from '@art-js/constructs';
import { type ParserVisitContext } from '@art-js/primitives';
import { fromMarkdown } from 'mdast-util-from-markdown';
import type { Node } from 'unist';
import { SKIP, visit } from 'unist-util-visit';

import type { ParserConfig } from './config/types';
import { isBlockType } from './mdast/isBlockType';
import { createDocumentContext } from './private/createDocumentContext';

interface HandleResult {
	constructs: Construct[];
	handler: ConstructHandler | null;
}

export function buildDocument(config: ParserConfig, markdown: string): ArtDocument {
	const tree = fromMarkdown(markdown);
	const document = createDocument(tree);
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

			const processor = constructParser.processor;
			const construct = processor?.captureNode(currentContext, node);
			if (construct) {
				const handler = constructParser.handler ?? null;
				return {
					constructs: [construct],
					handler,
				};
			}
			const factory = constructParser.factory;
			if (i > 0 && factory?.detect(node, currentContext)) {
				const result = factory.create(node, currentContext);
				const constructs = Array.isArray(result) ? result : [result];
				const first = constructs[0] as Construct | undefined;
				const handler = constructs.length > 0 && first ? (constructParser.handler ?? null) : null;
				return {
					constructs,
					handler,
				};
			}
		}
		return null;
	}

	function handleNaturalBlock(node: Node): typeof SKIP | undefined {
		if (!defaultConstruct.factory) {
			return SKIP;
		}

		const construct = defaultConstruct.factory.create(node, currentContext) as Construct;
		currentContext = currentContext.onBeforeConstruct(construct);
		currentContext.captureChildConstruct(construct);
		return node.type === 'paragraph' ? undefined : SKIP;
	}

	function dispatch(node: Node, constructs: Construct[], handler: ConstructHandler | null): void {
		for (const construct of constructs) {
			currentContext = currentContext.onBeforeConstruct(construct);

			if (handler) {
				currentContext = handler.handle(construct, node, currentContext);
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
			dispatch(node, result.constructs, result.handler);
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
