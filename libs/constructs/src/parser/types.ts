/* eslint-disable @typescript-eslint/no-explicit-any */

import type { MdastNode, ParserVisitContext } from '@art-js/primitives';

import type { Construct } from '../constructs/types';

export type ConstructProcessor = {
	captureNode(context: ParserVisitContext, node: MdastNode): Construct | null;
};

export type ConstructIntegrator = {
	integrate(context: ParserVisitContext, node: MdastNode, construct: Construct): ParserVisitContext;
};

export type ConstructParser = {
	readonly name: string;
	processor?: ConstructProcessor;
	integrator?: ConstructIntegrator;
};

export type ConstructParserFactory = () => ConstructParser;
