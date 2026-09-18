/**
 * @mocks createSectionBlockFromNode() from `@art-js/constructs`
 */

import { vi } from 'vitest';

export const createSectionBlockFromNodeMock = (
	name: string = 'Test',
): {
	createSectionBlockFromNode: ReturnType<typeof vi.fn>;
} => ({
	createSectionBlockFromNode: vi.fn(() => ({
		construct: 'SectionBlock',
		name,
		children: [],
	})),
});
