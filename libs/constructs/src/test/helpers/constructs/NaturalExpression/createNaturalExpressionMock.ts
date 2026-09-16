/**
 * @mocks createNaturalExpression() from `@art-js/constructs`
 */

import { vi } from 'vitest';

export const createNaturalExpressionMock = (): {
	createNaturalExpression: ReturnType<typeof vi.fn>;
} => ({
	createNaturalExpression: vi.fn(child => ({
		construct: 'NaturalExpression',
		type: (child as { type: string }).type,
		value: (child as { value: string }).value,
		children: [],
	})),
});
