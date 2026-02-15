import { DynamicText, ValueFieldComponent } from '@ng-forge/dynamic-forms';
import { InputField, InputMeta, InputProps } from '@ng-forge/dynamic-forms/integration';

export interface HlmInputProps extends InputProps {
  hint?: DynamicText;
}

export type HlmInputField = InputField<HlmInputProps>;

export type HlmInputComponent = ValueFieldComponent<HlmInputField>;

export type { InputMeta };
