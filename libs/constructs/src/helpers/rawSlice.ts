import type { MdastNode, ParserVisitContext } from '@art-js/primitives';

export function rawSlice(node: MdastNode, context: ParserVisitContext): string {
	const start = node.position?.start?.offset;
	const end = node.position?.end?.offset;
	return start === undefined || end === undefined ? '' : context.markdown.slice(start, end);
}
