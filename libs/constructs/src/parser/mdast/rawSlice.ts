import type { MdastNode, ParserVisitContext } from '@art-js/primitives';

export function rawSlice(node: MdastNode, context: ParserVisitContext): string {
	if (!node.position?.start || !node.position?.end) {
		return '';
	}
	return context.source.markdown.slice(node.position.start.offset, node.position.end.offset);
}
