import { describe, expect, it, vi } from 'vitest';

import { rawSlice } from '../../../helpers/rawSlice';

import { stripStrong } from './stripStrong';

vi.mock('../../../helpers/rawSlice', async () => {
	const { rawSliceMock } = await import('../../../test/helpers/constructs/rawSliceMock');
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
