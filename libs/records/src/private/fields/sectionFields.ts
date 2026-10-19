import type {
	FieldBlock,
	FieldInline,
	NaturalBlock,
	NaturalExpression,
	SectionBlock,
} from '@art-md/constructs';
import type { ConstructBase } from '@art-md/primitives';

type SectionField = FieldBlock | FieldInline;

function isSectionField(construct: ConstructBase): construct is SectionField {
	return construct.construct === 'FieldBlock' || construct.construct === 'FieldInline';
}

function readText(construct: unknown): string {
	if (typeof construct !== 'object' || construct === null) return '';
	if ('value' in construct && typeof construct.value === 'string') return construct.value;
	if ('children' in construct && Array.isArray(construct.children)) {
		return construct.children.map(readText).join('');
	}
	return '';
}

function findField(section: SectionBlock, name: string): SectionField | undefined {
	return section.children.find(
		(construct): construct is SectionField => isSectionField(construct) && construct.name === name,
	);
}

function textExpression(value: string): NaturalExpression {
	return {
		construct: 'NaturalExpression',
		type: 'text',
		value,
		children: [],
	};
}

function textBlock(value: string): NaturalBlock {
	return {
		construct: 'NaturalBlock',
		value,
		children: [],
	};
}

export function getSectionField(section: SectionBlock, name: string): string | undefined {
	const field = findField(section, name);
	return field === undefined ? undefined : readText(field);
}

export function setSectionField(section: SectionBlock, name: string, value: unknown): void {
	const field = findField(section, name);
	const text = String(value);

	if (field?.construct === 'FieldInline') {
		field.children = [textExpression(text)];
		return;
	}

	if (field?.construct === 'FieldBlock') {
		field.children = [textBlock(text)];
		return;
	}

	const newField: FieldInline = {
		construct: 'FieldInline',
		name,
		children: [textExpression(text)],
	};
	section.children.push(newField);
}

export function renameSectionField(section: SectionBlock, oldName: string, newName: string): void {
	const field = findField(section, oldName);
	if (field === undefined) throw new Error(`Field not found: ${oldName}`);
	field.name = newName;
}

export function deleteSectionField(section: SectionBlock, name: string): boolean {
	const index = section.children.findIndex(
		construct => isSectionField(construct) && construct.name === name,
	);
	if (index === -1) return false;
	section.children.splice(index, 1);
	return true;
}

export function listSectionFieldNames(section: SectionBlock): string[] {
	return section.children.filter(isSectionField).map(field => field.name);
}
