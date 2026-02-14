import { DynamicText, FieldMeta, FieldOption, ValueFieldComponent, ValueType } from '@ng-forge/dynamic-forms';
import { RadioField } from '@ng-forge/dynamic-forms/integration';

export interface HlmRadioProps {
  hint?: DynamicText;
}

export type HlmRadioField<T = ValueType> = RadioField<T, HlmRadioProps>;

export type HlmRadioComponent<T = ValueType> = ValueFieldComponent<HlmRadioField<T>>;

export type { FieldMeta as RadioMeta };
