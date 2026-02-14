import { DynamicText, FieldMeta, ValueFieldComponent } from '@ng-forge/dynamic-forms';
import { SliderField } from '@ng-forge/dynamic-forms/integration';

export interface HlmSliderProps {
  hint?: DynamicText;
  showTicks?: boolean;
}

export type HlmSliderField = SliderField<HlmSliderProps>;

export type HlmSliderComponent = ValueFieldComponent<HlmSliderField>;

export type { FieldMeta as SliderMeta };
