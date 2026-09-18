import type { ContainerConstructBase } from '../../constructs';

import { createParserVisitContextBase } from './private/createParserVisitContextBase';
import type { ParserSource, ParserVisitContext } from './types';

export function createParserVisitContext(
	construct: ContainerConstructBase,
	source: ParserSource,
): ParserVisitContext {
	return createParserVisitContextBase(source, construct, undefined);
}
