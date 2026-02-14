import { DynamicText, FieldMeta, ValueFieldComponent, ValueType } from '@ng-forge/dynamic-forms';
import { SelectField, SelectProps } from '@ng-forge/dynamic-forms/integration';

export interface HlmSelectProps extends SelectProps {
  hint?: DynamicText;
  multiple?: boolean;
  compareWith?: (o1: ValueType, o2: ValueType) => boolean;
}

export type HlmSelectField<T = ValueType> = SelectField<T, HlmSelectProps>;

export type HlmSelectComponent<T = ValueType> = ValueFieldComponent<HlmSelectField<T>>;

export type { FieldMeta as SelectMeta };
