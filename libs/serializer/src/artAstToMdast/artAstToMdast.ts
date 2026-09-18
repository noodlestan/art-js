import type { ConstructSerializer } from '@art-js/constructs';
import type { ArtDocument } from '@art-js/primitives';
import type { Node, Root } from 'mdast';

import type { SerialisableNode, SerializerConfig } from '../config/types';

export function artAstToMdast(config: SerializerConfig, document: ArtDocument): Node {
	const registry = new Map<string, ConstructSerializer>();
	for (const factory of config.constructs) {
		const toMdast = factory();
		registry.set(toMdast.name, toMdast);
	}

	function visit(node: SerialisableNode): Node[] {
		let rawChildren: unknown[] = [];
		if ('children' in node && Array.isArray(node.children)) {
			rawChildren = node.children;
		} else if ('value' in node && Array.isArray(node.value)) {
			rawChildren = node.value;
		}

		const nestedConstructs = rawChildren.filter(
			(c): c is SerialisableNode => typeof c === 'object' && c !== null && 'construct' in c,
		);
		const childNodes: Node[] = nestedConstructs.flatMap(visit);

		const toMdast = registry.get(node.construct);
		if (!toMdast) {
			throw new Error(`Unknown construct: ${node.construct}`);
		}
		const mainNode = toMdast.toMdast(node as never, childNodes);
		const mainNodes = mainNode.type === 'root' ? (mainNode as Root).children : [mainNode];

		// For block constructs with nested children content (SectionBlock, FieldBlock),
		// return the main node followed by the children as siblings.
		if (
			'children' in node &&
			Array.isArray(node.children) &&
			node.children.length > 0 &&
			(node.construct === 'SectionBlock' || node.construct === 'FieldBlock')
		) {
			return [...mainNodes, ...childNodes];
		}

		return mainNodes;
	}

	const mdastChildren = document.children.flatMap(child => visit(child as SerialisableNode));
	return { type: 'root', children: mdastChildren } as Node;
}
