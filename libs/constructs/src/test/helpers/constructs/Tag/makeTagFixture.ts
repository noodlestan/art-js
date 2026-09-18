/**
 * @fixture Tag of factory`libs/constructs/src/constructs/Tag/factory/createTag.ts`
 */

import type { Tag } from '../../../../factories';

export const makeTagFixture = (options?: { name?: string }): Tag => ({
	construct: 'Tag',
	name: options?.name ?? 'test',
});
