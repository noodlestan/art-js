import { describe, expect, it, vi } from 'vitest';

import { stripStrongMock } from '../../test/helpers';

import { isFieldStrong } from './isFieldStrong';

vi.mock('./stripStrong', () => {
	return stripStrongMock('Purpose:');
});

describe('isFieldStrong', () => {
	it('FOR a strong node matching field pattern returns true', () => {
		const node = { type: 'strong', children: [{ type: 'text', value: 'Purpose:' }] };

		const result = isFieldStrong(node, { markdown: '**Purpose:**' } as never);

		expect(result).toBe(true);
	});

	it('FOR non-strong node returns false', () => {
		const node = { type: 'text', value: 'Purpose:' };

		const result = isFieldStrong(node, { markdown: 'Purpose:' } as never);

		expect(result).toBe(false);
	});
});
