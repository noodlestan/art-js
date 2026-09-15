import { describe, expect, it, vi } from 'vitest';

vi.mock('../../../helpers/rawSlice', async () => {
	const { makeRawSliceMock } = await import('../../../test/helpers/rawSlice/makeRawSliceMock');
	return makeRawSliceMock('');
});

vi.mock('../../Tag/private/extractTags', async () => {
	const { makeExtractTagsMock } =
		await import('../../../test/helpers/extractTags/makeExtractTagsMock');
	return makeExtractTagsMock([], '');
});

vi.mock('./createFieldBlockFromParagraph', async () => {
	const { makeCreateFieldBlockFromParagraphMock } =
		await import('../../../test/helpers/createFieldBlockFromParagraph/makeCreateFieldBlockFromParagraphMock');
	return makeCreateFieldBlockFromParagraphMock();
});

vi.mock('./isFieldStrong', async () => {
	const { makeIsFieldStrongMock } =
		await import('../../../test/helpers/isFieldStrong/makeIsFieldStrongMock');
	return makeIsFieldStrongMock();
});

describe('createFieldBlockProcessor', () => {
	it('returns a processor', async () => {
		const { createFieldBlockProcessor } = await import('./createFieldBlockProcessor');
		const processor = createFieldBlockProcessor();
		expect(processor.captureNode).toBeInstanceOf(Function);
	});
});
