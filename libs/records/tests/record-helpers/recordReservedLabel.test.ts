import { describe, expect, it } from 'vitest';

import { isReservedFieldName } from '../../src/record/private/field-name/isReservedFieldName.js';
import { labelToName } from '../../src/record/private/field-name/labelToName.js';
import {
	createSectionRecord,
	extractTestRecord,
	getFieldNames,
	makeFieldInline,
} from '../helpers/records/index.js';

import {
	nonReservedLabelCases,
	reachableCollisionLabels,
	reservedLabelCases,
	reservedLabelRecordName,
	reservedLabelValue,
} from './recordReservedLabel.fixtures.js';

describe('record reserved labels', () => {
	it('GIVEN the reserved labels WHEN counting the reachable collisions THEN fourteen labels resolve to the fourteen reserved names', () => {
		expect(reachableCollisionLabels).toHaveLength(14);

		for (const label of reachableCollisionLabels) {
			expect(isReservedFieldName(labelToName(label))).toBe(true);
			expect(reservedLabelCases.some(([caseLabel]) => caseLabel === label)).toBe(true);
		}
	});
	it.each(reservedLabelCases)(
		'WHEN extracting the "%s" label that converts to "%s" THEN the reserved-name TypeError is thrown',
		async (label, reservedName) => {
			const documentContent = `## ${reservedLabelRecordName}\n\n**${label}:** ${reservedLabelValue}\n`;

			let thrownError: unknown;
			try {
				await extractTestRecord(documentContent, reservedLabelRecordName);
			} catch (error) {
				thrownError = error;
			}

			expect(thrownError).toBeInstanceOf(TypeError);
			expect((thrownError as Error).message).toBe(
				`Field label "${label}" resolves to reserved name "${reservedName}"`,
			);
		},
	);

	it.each(nonReservedLabelCases)(
		'WHEN indexing the hand-built "%s" label THEN it registers as "%s" without throwing',
		(label, registeredName) => {
			const record = createSectionRecord(reservedLabelRecordName, [
				makeFieldInline(label, reservedLabelValue),
			]);

			expect(getFieldNames(record)).toEqual([registeredName]);
			expect(record[registeredName]).toBe(reservedLabelValue);
		},
	);
});
