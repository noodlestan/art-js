import { BLOCK_TYPES } from './constants';

export function isBlockType(type: string): boolean {
	return BLOCK_TYPES.has(type);
}
