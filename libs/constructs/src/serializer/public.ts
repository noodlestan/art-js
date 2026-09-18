import { createDocumentToMdast } from './constructs/Document';
import { createFieldBlockToMdast } from './constructs/FieldBlock';
import { createFieldInlineToMdast } from './constructs/FieldInline';
import { createNaturalBlockToMdast } from './constructs/NaturalBlock';
import { createNaturalExpressionToMdast } from './constructs/NaturalExpression';
import { createSectionBlockToMdast } from './constructs/SectionBlock';
import type { ConstructSerializerFactory } from './types';

export const CONSTRUCT_SERIALIZERS: ConstructSerializerFactory[] = [
	createDocumentToMdast,
	createFieldBlockToMdast,
	createFieldInlineToMdast,
	createNaturalBlockToMdast,
	createNaturalExpressionToMdast,
	createSectionBlockToMdast,
];

export type * from './types';
