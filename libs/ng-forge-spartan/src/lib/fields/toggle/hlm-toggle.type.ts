import { DynamicText, FieldMeta, ValueFieldComponent } from '@ng-forge/dynamic-forms';
import { ToggleField } from '@ng-forge/dynamic-forms/integration';

export interface HlmToggleProps {
  hint?: DynamicText;
}

export type HlmToggleField = ToggleField<HlmToggleProps>;

export type HlmToggleComponent = ValueFieldComponent<HlmToggleField>;

export type { FieldMeta as ToggleMeta };
