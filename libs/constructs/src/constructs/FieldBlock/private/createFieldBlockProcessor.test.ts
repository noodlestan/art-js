import { describe, expect, it, vi } from 'vitest';

import { extractTags } from '../../Tag/private/extractTags';

import { isFieldStrong } from './isFieldStrong';

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

	it('returns null for non-paragraph nodes', async () => {
		const { createFieldBlockProcessor } = await import('./createFieldBlockProcessor');
		const processor = createFieldBlockProcessor();
		const heading = { type: 'heading', children: [] };
		const result = processor.captureNode({ markdown: '' } as never, heading as never);
		expect(result).toBeNull();
	});

	it('returns null for paragraph with no children', async () => {
		const { createFieldBlockProcessor } = await import('./createFieldBlockProcessor');
		const processor = createFieldBlockProcessor();
		const paragraph = { type: 'paragraph', children: [] };
		const result = processor.captureNode({ markdown: '' } as never, paragraph as never);
		expect(result).toBeNull();
	});

	it('returns null when first child is not a field strong', async () => {
		vi.mocked(isFieldStrong).mockReturnValue(false);
		const { createFieldBlockProcessor } = await import('./createFieldBlockProcessor');
		const processor = createFieldBlockProcessor();
		const paragraph = { type: 'paragraph', children: [{ type: 'text', value: 'hello' }] };
		const result = processor.captureNode({ markdown: '' } as never, paragraph as never);
		expect(result).toBeNull();
	});

	it('returns null when text after strong is not empty', async () => {
		vi.mocked(isFieldStrong).mockReturnValue(true);
		vi.mocked(extractTags).mockReturnValue({ tags: [], stripped: ' leftover' });
		const { createFieldBlockProcessor } = await import('./createFieldBlockProcessor');
		const processor = createFieldBlockProcessor();
		const paragraph = { type: 'paragraph', children: [{ type: 'strong', children: [] }] };
		const result = processor.captureNode({ markdown: '' } as never, paragraph as never);
		expect(result).toBeNull();
	});

	it('returns a FieldBlock when paragraph matches', async () => {
		vi.mocked(isFieldStrong).mockReturnValue(true);
		vi.mocked(extractTags).mockReturnValue({ tags: [], stripped: '' });
		const { createFieldBlockProcessor } = await import('./createFieldBlockProcessor');
		const processor = createFieldBlockProcessor();
		const paragraph = { type: 'paragraph', children: [{ type: 'strong', children: [] }] };
		const result = processor.captureNode({ markdown: '' } as never, paragraph as never);
		expect(result).toMatchObject({ construct: 'FieldBlock', name: 'Test' });
	});
});
