import type { NaturalExpression } from '../../../NaturalExpression';

export function trimFieldEdges(value: NaturalExpression[]): typeof value {
	const trimmed = [...value];
	const first = trimmed[0];
	const last = trimmed[trimmed.length - 1];

	if (first?.type === 'text' && typeof first?.value === 'string')
		first.value = first.value.replace(/^\s+/, '');
	if (last?.type === 'text' && typeof last?.value === 'string')
		last.value = last.value.replace(/\s+$/, '');

	return trimmed.filter(
		expression =>
			expression.type !== 'text' ||
			(typeof expression.value === 'string' && expression.value.length > 0),
	);
}
