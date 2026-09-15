import { describe, expect, it, vi } from 'vitest';

vi.mock('@art-js/primitives', async () => {
	const { makeNodePositionMock } =
		await import('../../../test/helpers/primitives/makeNodePositionMock');
	return makeNodePositionMock();
});

vi.mock('../../../helpers/rawSlice', async () => {
	const { makeRawSliceMock } = await import('../../../test/helpers/rawSlice/makeRawSliceMock');
	return makeRawSliceMock('hello');
});

vi.mock('../../NaturalExpression/private/createNaturalExpression', async () => {
	const { makeCreateNaturalExpressionMock } =
		await import('../../../test/helpers/createNaturalExpression/makeCreateNaturalExpressionMock');
	return makeCreateNaturalExpressionMock();
});

vi.mock('../../Tag/private/extractTags', async () => {
	const { makeExtractTagsMock } =
		await import('../../../test/helpers/extractTags/makeExtractTagsMock');
	return makeExtractTagsMock([], 'hello');
});

describe('createNaturalBlock', () => {
	it('creates a NaturalBlock from a node', async () => {
		const { createNaturalBlock } = await import('./createNaturalBlock');
		const node = {
			type: 'paragraph',
			position: { start: { offset: 0 }, end: { offset: 5 } },
			children: [{ type: 'text', value: 'hello' }],
		};
		const context = { markdown: '' } as never;
		const result = createNaturalBlock(node as never, context);
		expect(result.construct).toBe('NaturalBlock');
		expect(result.value).toBe('hello');
	});
});
