/**
 * @mocks createSectionBlock() from `src/constructs/SectionBlock/private/factory`
 */

import { vi } from 'vitest';

export const createSectionBlockMock = (
	name: string = 'Test',
): {
	createSectionBlock: ReturnType<typeof vi.fn>;
} => ({
	createSectionBlock: vi.fn(() => ({
		construct: 'SectionBlock',
		name,
		children: [],
	})),
});
