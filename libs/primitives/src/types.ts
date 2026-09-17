/** A point in the source. */
export type Point = {
	line: number;
	column: number;
	offset: number;
};

/** The source span of a record. */
export type Position = {
	start: Point;
	end: Point;
};

/** Base type implemented by every construct. */
export type ConstructBase = {
	/** Discriminator — the construct class (e.g. 'SectionBlock'). */
	construct: string;
	/** Source position, carried from the visited mdast nodes. */
	position?: Position;
};

export type ContainerConstructBase = ConstructBase & {
	children: ConstructBase[];
};

/** Document — the parse result for one source file. */
export type Document<TChildren extends ConstructBase = ConstructBase> = ConstructBase & {
	construct: 'Document';
	children: TChildren[];
};
