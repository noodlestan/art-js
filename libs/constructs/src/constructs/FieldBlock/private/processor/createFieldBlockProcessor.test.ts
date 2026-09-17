import { describe, expect, it, vi } from 'vitest';

import {
	createFieldBlockFromNodeMock,
	extractTagsMock,
	isFieldStrongMock,
	rawSliceMock,
} from '../../../../test/helpers';
// eslint-disable-next-line import/order
import { extractTags } from '../../../../shared/tags';
// eslint-disable-next-line import/order
import { isFieldStrong } from '../../../../shared/fields';

import { createFieldBlockProcessor } from './createFieldBlockProcessor';

vi.mock('../../../../shared/mdast', () => {
	return rawSliceMock('');
});

vi.mock('../../../../shared/fields', async importOriginal => {
	const actual = (await importOriginal()) as object;
	return {
		...actual,
		...isFieldStrongMock(),
	};
});

vi.mock('../../../../shared/tags', async () => {
	return extractTagsMock([], '');
});

vi.mock('../helpers/createFieldBlockFromNode', () => {
	return createFieldBlockFromNodeMock();
});

describe('createFieldBlockProcessor', () => {
	it('WHEN the mocked isFieldStrong returns true by default returns a FieldBlock', async () => {
		const processor = createFieldBlockProcessor();
		const paragraph = { type: 'paragraph', children: [{ type: 'strong', children: [] }] };

		const result = processor.captureNode({ markdown: '' } as never, paragraph as never);

		expect(result).toMatchObject({ construct: 'FieldBlock', name: 'Test' });
	});

	it('WHEN called returns a processor', async () => {
		const processor = createFieldBlockProcessor();

		expect(processor.captureNode).toBeInstanceOf(Function);
	});

	it('FOR non-paragraph nodes returns null', async () => {
		const processor = createFieldBlockProcessor();
		const heading = { type: 'heading', children: [] };

		const result = processor.captureNode({ markdown: '' } as never, heading as never);

		expect(result).toBeNull();
	});

	it('FOR paragraph with no children returns null', async () => {
		const processor = createFieldBlockProcessor();
		const paragraph = { type: 'paragraph', children: [] };

		const result = processor.captureNode({ markdown: '' } as never, paragraph as never);

		expect(result).toBeNull();
	});

	it('WHEN first child is not a field strong returns null', async () => {
		vi.mocked(isFieldStrong).mockReturnValue(false);
		const processor = createFieldBlockProcessor();
		const paragraph = { type: 'paragraph', children: [{ type: 'text', value: 'hello' }] };

		const result = processor.captureNode({ markdown: '' } as never, paragraph as never);

		expect(result).toBeNull();
	});

	it('WHEN text after strong is not empty returns null', async () => {
		vi.mocked(isFieldStrong).mockReturnValue(true);
		vi.mocked(extractTags).mockReturnValue({ tags: [], stripped: ' leftover' });
		const processor = createFieldBlockProcessor();
		const paragraph = { type: 'paragraph', children: [{ type: 'strong', children: [] }] };

		const result = processor.captureNode({ markdown: '' } as never, paragraph as never);

		expect(result).toBeNull();
	});

	it('WHEN paragraph matches returns a FieldBlock', async () => {
		vi.mocked(isFieldStrong).mockReturnValue(true);
		vi.mocked(extractTags).mockReturnValue({ tags: [], stripped: '' });
		const processor = createFieldBlockProcessor();
		const paragraph = { type: 'paragraph', children: [{ type: 'strong', children: [] }] };

		const result = processor.captureNode({ markdown: '' } as never, paragraph as never);

		expect(result).toMatchObject({ construct: 'FieldBlock', name: 'Test' });
	});
});
