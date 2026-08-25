import type { ConstructBase } from '@art-js/primitives';

import type { BlockContent } from '../../../registry';

export interface FieldBlock extends ConstructBase {
	construct: 'FieldBlock';
	name: string;
	value: BlockContent[];
}
