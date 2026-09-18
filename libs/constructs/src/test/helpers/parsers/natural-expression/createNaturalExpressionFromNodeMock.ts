/**
 * @mocks createNaturalExpressionFromNode() from `src/parsers/NaturalExpression/private/helpers`
 */

import { vi } from 'vitest';

export const createNaturalExpressionFromNodeMock = (): {
	createNaturalExpressionFromNode: ReturnType<typeof vi.fn>;
} => ({
	createNaturalExpressionFromNode: vi.fn(child => ({
		construct: 'NaturalExpression',
		type: (child as { type: string }).type,
		value: (child as { value: string }).value,
		children: [],
	})),
});
