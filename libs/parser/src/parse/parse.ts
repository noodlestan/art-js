import { type ArtDocument } from '@art-js/primitives';

import { buildDocument } from '../buildDocument/buildDocument';
import { createDefaultConfig } from '../config';
import { createDocumentParserContext } from '../private';

export function parse(markdown: string = ''): ArtDocument {
	const config = createDefaultConfig();
	const docContext = createDocumentParserContext(markdown);

	const defaultConstruct = config.defaultConstruct();
	const constructParsers = config.constructs.map(create => create());

	return buildDocument(defaultConstruct, constructParsers, docContext);
}
