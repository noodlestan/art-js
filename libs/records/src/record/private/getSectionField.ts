import type { ArtCodec } from '@art-md/primitives';

import type { SectionField } from './types.js';

export function getSectionField(codec: ArtCodec, field: SectionField): string {
	return codec.toText(field);
}
