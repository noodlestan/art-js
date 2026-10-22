import { createRecordCapsule } from './private/createRecordCapsule.js';
import { createRecordProxy } from './private/createRecordProxy.js';
import type { ArtRecord, RecordHandleContext } from './types.js';

export function wrapSectionAsRecord(context: RecordHandleContext): ArtRecord {
	const capsule = createRecordCapsule(context);
	const record = createRecordProxy(capsule);

	return record;
}
