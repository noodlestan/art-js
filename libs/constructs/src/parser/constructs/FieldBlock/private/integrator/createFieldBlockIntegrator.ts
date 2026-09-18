import type { FieldBlock } from '../../../../../factories';
import type { ConstructIntegrator } from '../../../../types';
import { onBeforeConstruct } from '../helpers/onBeforeConstruct';

export function createFieldBlockIntegrator(): ConstructIntegrator {
	return {
		integrate(context, _node, construct) {
			const field = construct as FieldBlock;
			context.captureChildConstruct(field);
			return context.childContext(field, onBeforeConstruct);
		},
	};
}
