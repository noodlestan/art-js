/**
 * @provides Tag test fixture
 */

import type { Tag } from '../../../../constructs/Tag/types';

export const makeTagMock = (options?: { name?: string }): Tag => ({
	construct: 'Tag',
	name: options?.name ?? 'test',
});
