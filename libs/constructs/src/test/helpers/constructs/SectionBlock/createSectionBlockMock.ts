/**
 * @mocks createSectionBlock() from `@art-js/constructs`
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
