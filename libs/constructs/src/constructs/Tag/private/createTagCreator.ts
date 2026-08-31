import type { Text } from 'mdast';

import type { ConstructCreator } from '../../types';

import { TAG_PATTERN } from './constants';
import { createTag } from './createTag';

export function createTagCreator(): ConstructCreator {
	return {
		detect(node) {
			return node.type === 'text' && TAG_PATTERN.test((node as Text).value);
		},
		create(node) {
			return createTag(node as Text);
		},
	};
}
