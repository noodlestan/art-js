/** Base interface implemented by every construct */
export interface ConstructBase {
	/** Discriminator — the construct class (e.g. 'SectionBlock'). */
	construct: string;
	/** Source position, carried from the visited mdast nodes. */
	position?: Position;
}

export interface ContainerConstructBase extends ConstructBase {
	children: ConstructBase[];
}

/** A point in the source. */
export interface Point {
	line: number;
	column: number;
	offset: number;
}

/** The source span of a record. */
export interface Position {
	start: Point;
	end: Point;
}
