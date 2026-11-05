import type { ArtCodec, ArtDocument } from '@art-md/primitives';

import type { SectionField } from '../types.js';

export function readSectionFieldMarkdown(codec: ArtCodec, field: SectionField): string {
	const document: ArtDocument = { construct: 'Document', children: field.children };
	const serialized = codec.serialize(document);

	return serialized.content.replace(/\n$/, '');
}
