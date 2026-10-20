import { createRecordCapsule } from './private/createRecordCapsule.js';
import { createRecordProxy } from './private/createRecordProxy.js';
import type { ArtRecordCapsuleContext } from './private/types.js';
import type { ArtRecord, RecordContext } from './types.js';

export function wrapSectionAsRecord(context: RecordContext): ArtRecord {
	const capsuleContext: ArtRecordCapsuleContext = context;
	const capsule = createRecordCapsule(capsuleContext);
	const record = createRecordProxy(capsule);
	return record;
}
