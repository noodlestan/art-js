import {
	type ArtDocument,
	type BlockContent,
	type Construct,
	type ConstructHandler,
	type ConstructParser,
} from '@art-js/constructs';
import type { ParserVisitContext } from '@art-js/primitives';
import { fromMarkdown } from 'mdast-util-from-markdown';
import type { Node } from 'unist';
import { SKIP, visit } from 'unist-util-visit';

import type { ParserConfig } from './config/types';
import { isBlockType } from './constants';
import { createDocumentContext } from './private/createDocumentContext';

interface HandleResult {
	records: Construct[];
	handler: ConstructHandler | null;
}

export function buildDocument(config: ParserConfig, markdown: string): ArtDocument {
	const document: ArtDocument = {
		construct: 'Document',
		children: [],
		// position: {
		// 	start: {
		// 		line: 0,
		// 		column: 0,
		// 		offset: 0,
		// 	},
		// 	end: {
		// 		line: 0,
		// 		column: 0,
		// 		offset: 0,
		// 	},
		// },
	};
	const tree = fromMarkdown(markdown);
	// process.exit();
	const docContext = createDocumentContext(document, markdown);
	const defaultConstruct = config.defaultConstruct();
	const constructs = [defaultConstruct, ...config.constructs.map(create => create())];
	let currentContext: ParserVisitContext = docContext;

	function tryConstructs(node: Node): HandleResult | null {
		if (node.type === 'root') {
			return null;
		}

		for (let i = 0; i < constructs.length; i++) {
			const construct = constructs[i] as ConstructParser;
			const preProcessor = construct.preProcessor;
			const record = preProcessor?.preProcess(node, currentContext);
			if (record) {
				const rec = record as Construct;
				const handler = construct.handler ?? null;
				return {
					records: [rec],
					handler,
				};
			}
			const factory = construct.factory;
			if (i > 0 && factory?.detect(node, currentContext)) {
				const result = factory.create(node, currentContext);
				const records = Array.isArray(result) ? result : [result];
				const firstRecord = records[0] as Construct | undefined;
				const handler = records.length > 0 && firstRecord ? (construct.handler ?? null) : null;
				return {
					records,
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
			dispatch(node, result.records, result.handler);
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
