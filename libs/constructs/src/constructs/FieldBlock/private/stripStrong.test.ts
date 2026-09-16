import { describe, expect, it, vi } from 'vitest';

// eslint-disable-next-line import/order
import { rawSliceMock } from '../../../test/helpers/constructs/rawSliceMock';
// eslint-disable-next-line import/order
import { rawSlice } from '../../../helpers/rawSlice';

import { stripStrong } from './stripStrong';

vi.mock('../../../helpers/rawSlice', () => {
	return rawSliceMock();
});

describe('stripStrong', () => {
	it('WHEN stripping ** wrappers', () => {
		vi.mocked(rawSlice).mockReturnValue('**hello**');

		const result = stripStrong({ type: 'strong', children: [] }, { markdown: '' } as never);

		expect(result).toBe('hello');
	});

	it('WHEN stripping __ wrappers', () => {
		vi.mocked(rawSlice).mockReturnValue('__hello__');

		const result = stripStrong({ type: 'strong', children: [] }, { markdown: '' } as never);

		expect(result).toBe('hello');
	});

	it('WHEN not wrapped returns raw', () => {
		vi.mocked(rawSlice).mockReturnValue('hello');

		const result = stripStrong({ type: 'strong', children: [] }, { markdown: '' } as never);

		expect(result).toBe('hello');
	});
});
