import type { Construct } from '../../registry';
import type { ConstructParserFactory } from '../types';

import { type DocumentFactoryData, createDocumentFromData } from './private/createDocumentFromData';

export const createDocumentParser: ConstructParserFactory = () => ({
	name: 'Document',
	factory: {
		fromData: data => createDocumentFromData(data as DocumentFactoryData) as unknown as Construct,
	},
});
