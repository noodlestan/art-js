import { CONSTRUCT_SERIALIZERS } from '@art-js/constructs';

import type { SerializerConfig } from './types';

export function createDefaultSerializerConfig(): SerializerConfig {
	return {
		constructs: CONSTRUCT_SERIALIZERS,
	};
}
