import type { BlockContent, Construct, NaturalBlock, NaturalExpression } from '@art-md/constructs';
import type { ArtCodec, ConstructBase } from '@art-md/primitives';

import type { ClassifiedSectionFieldValue } from '../types.js';

const CONTAINER_CONSTRUCT_NAMES: readonly string[] = [
	'Document',
	'SectionBlock',
	'FieldBlock',
	'FieldInline',
];

const CONTAINER_VALUE_ERROR =
	'Field value must not be a Document, SectionBlock, FieldBlock, or FieldInline';

const INVALID_VALUE_ERROR = 'Field value must be a string, number, boolean, or Art AST value';

function getConstructName(value: unknown): string | undefined {
	if (typeof value !== 'object' || value === null) {
		return undefined;
	}

	const constructName = (value as { construct?: unknown }).construct;
	if (typeof constructName !== 'string') {
		return undefined;
	}

	return constructName;
}

function isContainerConstruct(value: unknown): boolean {
	const constructName = getConstructName(value);
	if (constructName === undefined) {
		return false;
	}

	return CONTAINER_CONSTRUCT_NAMES.includes(constructName);
}

function isArtConstruct(value: unknown): value is Construct {
	return getConstructName(value) !== undefined;
}

function assertNoContainerConstructs(values: readonly unknown[]): void {
	for (const value of values) {
		if (isContainerConstruct(value)) {
			throw new TypeError(CONTAINER_VALUE_ERROR);
		}
	}
}

function buildParsedContent(codec: ArtCodec, markdown: string): ConstructBase[] {
	const children = codec.parse(markdown).document.children;

	assertNoContainerConstructs(children);

	return children;
}

function buildArrayContent(value: readonly unknown[]): ConstructBase[] {
	assertNoContainerConstructs(value);

	for (const member of value) {
		if (!isArtConstruct(member)) {
			throw new TypeError(INVALID_VALUE_ERROR);
		}
	}

	const constructs = value as readonly Construct[];

	return [...constructs];
}

function buildContent(codec: ArtCodec, value: unknown): ConstructBase[] {
	if (typeof value === 'number' || typeof value === 'boolean') {
		return buildContent(codec, String(value));
	}

	if (typeof value === 'string') {
		return buildParsedContent(codec, value);
	}

	if (isContainerConstruct(value)) {
		throw new TypeError(CONTAINER_VALUE_ERROR);
	}

	if (Array.isArray(value)) {
		return buildArrayContent(value);
	}

	if (isArtConstruct(value)) {
		return [value];
	}

	throw new TypeError(INVALID_VALUE_ERROR);
}

function isNaturalExpression(construct: ConstructBase): construct is NaturalExpression {
	return construct.construct === 'NaturalExpression';
}

function isParagraphNaturalBlock(construct: ConstructBase): construct is NaturalBlock {
	return construct.construct === 'NaturalBlock' && (construct as NaturalBlock).type === 'paragraph';
}

function getSingleParagraphBlock(content: readonly ConstructBase[]): NaturalBlock | undefined {
	if (content.length !== 1) {
		return undefined;
	}

	const [onlyChild] = content;
	if (onlyChild === undefined || !isParagraphNaturalBlock(onlyChild)) {
		return undefined;
	}

	return onlyChild;
}

function classifyContent(content: ConstructBase[]): ClassifiedSectionFieldValue {
	if (content.length === 0) {
		return { form: 'FieldInline', children: [] };
	}

	const paragraph = getSingleParagraphBlock(content);
	if (paragraph !== undefined) {
		return { form: 'FieldInline', children: paragraph.children as NaturalExpression[] };
	}

	if (content.every(isNaturalExpression)) {
		return { form: 'FieldInline', children: content };
	}

	return { form: 'FieldBlock', children: content as BlockContent[] };
}

export function classifySectionFieldValue(
	codec: ArtCodec,
	value: unknown,
): ClassifiedSectionFieldValue {
	const content = buildContent(codec, value);

	return classifyContent(content);
}
