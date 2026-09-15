import { describe, expect, it, vi } from 'vitest';

import { rawSlice } from '../../../helpers/rawSlice';

import { stripStrong } from './stripStrong';

vi.mock('../../../helpers/rawSlice', async () => {
	const { makeRawSliceMock } = await import('../../../test/helpers/rawSlice/makeRawSliceMock');
	return makeRawSliceMock();
});

describe('stripStrong', () => {
	it('strips ** wrappers', () => {
		vi.mocked(rawSlice).mockReturnValue('**hello**');
		const result = stripStrong({ type: 'strong', children: [] }, { markdown: '' } as never);
		expect(result).toBe('hello');
	});

	it('strips __ wrappers', () => {
		vi.mocked(rawSlice).mockReturnValue('__hello__');
		const result = stripStrong({ type: 'strong', children: [] }, { markdown: '' } as never);
		expect(result).toBe('hello');
	});

	it('returns raw when not wrapped', () => {
		vi.mocked(rawSlice).mockReturnValue('hello');
		const result = stripStrong({ type: 'strong', children: [] }, { markdown: '' } as never);
		expect(result).toBe('hello');
	});
});
