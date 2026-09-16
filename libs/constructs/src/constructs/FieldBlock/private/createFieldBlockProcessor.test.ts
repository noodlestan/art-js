import { describe, expect, it, vi } from 'vitest';

import { createFieldBlockFromParagraphMock } from '../../../test/helpers/constructs/FieldBlock/createFieldBlockFromParagraphMock';
import { rawSliceMock } from '../../../test/helpers/constructs/rawSliceMock';
import { extractTags } from '../../Tag/private/extractTags';

import { isFieldStrong } from './isFieldStrong';

vi.mock('../../../helpers/rawSlice', () => {
	return rawSliceMock('');
});

vi.mock('../../Tag/private/extractTags', async () => {
	const { extractTagsMock } = await import('../../../test/helpers/constructs/Tag/extractTagsMock');
	return extractTagsMock([], '');
});

vi.mock('./createFieldBlockFromParagraph', () => {
	return createFieldBlockFromParagraphMock();
});

vi.mock('./isFieldStrong', async () => {
	const { isFieldStrongMock } =
		await import('../../../test/helpers/constructs/FieldBlock/isFieldStrongMock');
	return isFieldStrongMock();
});

describe('createFieldBlockProcessor', () => {
	it('WHEN the mocked isFieldStrong returns true by default returns a FieldBlock', async () => {
		const { createFieldBlockProcessor } = await import('./createFieldBlockProcessor');
		const processor = createFieldBlockProcessor();
		const paragraph = { type: 'paragraph', children: [{ type: 'strong', children: [] }] };

		const result = processor.captureNode({ markdown: '' } as never, paragraph as never);

		expect(result).toMatchObject({ construct: 'FieldBlock', name: 'Test' });
	});

	it('WHEN called returns a processor', async () => {
		const { createFieldBlockProcessor } = await import('./createFieldBlockProcessor');

		const processor = createFieldBlockProcessor();

		expect(processor.captureNode).toBeInstanceOf(Function);
	});

	it('FOR non-paragraph nodes returns null', async () => {
		const { createFieldBlockProcessor } = await import('./createFieldBlockProcessor');
		const processor = createFieldBlockProcessor();
		const heading = { type: 'heading', children: [] };

		const result = processor.captureNode({ markdown: '' } as never, heading as never);

		expect(result).toBeNull();
	});

	it('FOR paragraph with no children returns null', async () => {
		const { createFieldBlockProcessor } = await import('./createFieldBlockProcessor');
		const processor = createFieldBlockProcessor();
		const paragraph = { type: 'paragraph', children: [] };

		const result = processor.captureNode({ markdown: '' } as never, paragraph as never);

		expect(result).toBeNull();
	});

	it('WHEN first child is not a field strong returns null', async () => {
		vi.mocked(isFieldStrong).mockReturnValue(false);
		const { createFieldBlockProcessor } = await import('./createFieldBlockProcessor');
		const processor = createFieldBlockProcessor();
		const paragraph = { type: 'paragraph', children: [{ type: 'text', value: 'hello' }] };

		const result = processor.captureNode({ markdown: '' } as never, paragraph as never);

		expect(result).toBeNull();
	});

	it('WHEN text after strong is not empty returns null', async () => {
		vi.mocked(isFieldStrong).mockReturnValue(true);
		vi.mocked(extractTags).mockReturnValue({ tags: [], stripped: ' leftover' });
		const { createFieldBlockProcessor } = await import('./createFieldBlockProcessor');
		const processor = createFieldBlockProcessor();
		const paragraph = { type: 'paragraph', children: [{ type: 'strong', children: [] }] };

		const result = processor.captureNode({ markdown: '' } as never, paragraph as never);

		expect(result).toBeNull();
	});

	it('WHEN paragraph matches returns a FieldBlock', async () => {
		vi.mocked(isFieldStrong).mockReturnValue(true);
		vi.mocked(extractTags).mockReturnValue({ tags: [], stripped: '' });
		const { createFieldBlockProcessor } = await import('./createFieldBlockProcessor');
		const processor = createFieldBlockProcessor();
		const paragraph = { type: 'paragraph', children: [{ type: 'strong', children: [] }] };

		const result = processor.captureNode({ markdown: '' } as never, paragraph as never);

		expect(result).toMatchObject({ construct: 'FieldBlock', name: 'Test' });
	});
});
