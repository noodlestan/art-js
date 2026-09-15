# Spec: Construct Types

This is the final shape of the construct types, for reference. Agents should only execute the changes prescribed in each iteration/commit but can use this reference to understand the final shape and stop reasoning about where the refactoring is going and just focus on their current task.

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { MdastNode, ParserVisitContext } from '@art-js/primitives';
import type { Node } from 'mdast';

import type { Construct } from '../registry';

export interface ConstructProcessor {
  captureNode(context: ParserVisitContext, node: MdastNode): Construct | null;
}

export interface ConstructIntegrator {
  integrate(context: ParserVisitContext, node: MdastNode, construct: Construct): ParserVisitContext;
}

export interface ConstructFactory {
  fromData(data: unknown): Construct;
}

export interface ConstructParser {
  readonly name: string;
  processor?: ConstructProcessor;
  integrator?: ConstructIntegrator;
  factory?: ConstructFactory;
}

export type ConstructParserFactory = () => ConstructParser;

export interface ConstructSerializer {
  readonly name: string;
  toMdast(node: Construct, children: Node[]): Node;
}

export type ConstructSerializerFactory = () => ConstructSerializer;
```
