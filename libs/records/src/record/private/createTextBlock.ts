import type { NaturalBlock } from '@art-md/constructs';

export function createTextBlock(value: string): NaturalBlock {
	return {
		construct: 'NaturalBlock',
		value,
		children: [],
	};
}
