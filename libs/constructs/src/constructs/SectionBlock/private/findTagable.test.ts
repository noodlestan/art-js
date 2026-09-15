import { describe, expect, it } from 'vitest';

import { findTagable } from './findTagable';

describe('findTagable', () => {
	it('returns the section block when found in context chain', () => {
		const section = { construct: 'SectionBlock', name: 'Test', children: [] };
		const context = {
			construct: section,
			parent: () => undefined,
		} as never;
		expect(findTagable(context)).toBe(section);
	});

	it('returns undefined when no section block is found', () => {
		const context = {
			construct: { construct: 'Document', children: [] },
			parent: () => undefined,
		} as never;
		expect(findTagable(context)).toBeUndefined();
	});

	it('walks up the parent chain', () => {
		const section = { construct: 'SectionBlock', name: 'Test', children: [] };
		const parent = {
			construct: section,
			parent: () => undefined,
		};
		const context = {
			construct: { construct: 'FieldBlock', name: 'Test', children: [] },
			parent: () => parent,
		} as never;
		expect(findTagable(context)).toBe(section);
	});
});
