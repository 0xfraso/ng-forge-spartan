import { DynamicText, FieldMeta, ValueFieldComponent } from '@ng-forge/dynamic-forms';
import { CheckboxField } from '@ng-forge/dynamic-forms/integration';

export interface HlmCheckboxProps {
  hint?: DynamicText;
}

export type HlmCheckboxField = CheckboxField<HlmCheckboxProps>;

export type HlmCheckboxComponent = ValueFieldComponent<HlmCheckboxField>;

export type { FieldMeta as CheckboxMeta };
