import type { Position } from '../parser';

/** Base type toMdastemented by every construct. */
export type ConstructBase = {
	/** Discriminator — the construct class (e.g. 'SectionBlock'). */
	construct: string;
	/** Source position, carried from the visited mdast nodes. */
	position?: Position;
};

export type ContainerConstructBase = ConstructBase & {
	children: ConstructBase[];
};
