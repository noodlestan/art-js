import {
	createDocumentToMdast,
	createFieldBlockToMdast,
	createFieldInlineToMdast,
	createNaturalBlockToMdast,
	createNaturalExpressionToMdast,
	createSectionBlockToMdast,
} from '@art-js/constructs';

import type { SerializerConfig } from './types';

export function createDefaultSerializerConfig(): SerializerConfig {
	return {
		constructs: [
			createDocumentToMdast,
			createNaturalBlockToMdast,
			createNaturalExpressionToMdast,
			createFieldBlockToMdast,
			createFieldInlineToMdast,
			createSectionBlockToMdast,
		],
	};
}
