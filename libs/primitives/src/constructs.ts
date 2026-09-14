import type { Position } from './point';

/** Base interface implemented by every construct record. */
export interface ConstructBase {
	/** Discriminator — the construct class (e.g. 'SectionBlock'). */
	construct: string;
	/** Source position, carried from the visited mdast nodes. */
	position?: Position;
}

export interface ContainerConstructBase extends ConstructBase {
	children: ConstructBase[];
}
