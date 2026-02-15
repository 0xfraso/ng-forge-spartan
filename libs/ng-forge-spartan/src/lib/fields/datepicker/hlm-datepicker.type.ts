import { DynamicText, FieldMeta, ValueFieldComponent } from '@ng-forge/dynamic-forms';
import { DatepickerField, DatepickerProps } from '@ng-forge/dynamic-forms/integration';

export interface HlmDatepickerProps extends DatepickerProps {
  hint?: DynamicText;
  captionLayout?: 'dropdown' | 'label' | 'dropdown-months' | 'dropdown-years';
  autoCloseOnSelect?: boolean;
}

export type HlmDatepickerField = DatepickerField<HlmDatepickerProps>;

export type HlmDatepickerComponent = ValueFieldComponent<HlmDatepickerField>;

export type { FieldMeta as DatepickerMeta };
