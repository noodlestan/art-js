import type { ConstructBase } from '@art-js/primitives';

export type Tag = ConstructBase & {
	construct: 'Tag';
	name: string;
};
