import type { ArtDocument } from '@art-js/constructs';

import { buildDocument } from './buildDocument/buildDocument';
import { createDefaultConfig } from './config';

export function parse(markdown?: string): ArtDocument {
	const config = createDefaultConfig();
	return buildDocument(config, markdown ?? '');
}
