import { makeParserVisitContextMock } from '@art-js/primitives/src/test/helpers';
import { describe, expect, it, vi } from 'vitest';

import { makeFieldBlockMock } from '../../../../test/helpers';
import { onBeforeConstruct } from '../helpers/onBeforeConstruct';

import { createFieldBlockIntegrator } from './createFieldBlockIntegrator';

describe('createFieldBlockIntegrator', () => {
	it('WHEN integrating captures the construct and returns a child context', () => {
		const integrator = createFieldBlockIntegrator();
		const context = makeParserVisitContextMock();
		const nextContext = makeParserVisitContextMock();
		vi.mocked(context.childContext).mockReturnValue(nextContext);
		const field = makeFieldBlockMock();

		const result = integrator.integrate(context, {} as never, field as never);

		expect(context.captureChildConstruct).toHaveBeenCalledWith(field);
		expect(context.childContext).toHaveBeenCalledWith(field, onBeforeConstruct);
		expect(result).toBe(nextContext);
	});
});
