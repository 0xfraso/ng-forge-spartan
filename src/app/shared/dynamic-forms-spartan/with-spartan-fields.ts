import { FieldTypeDefinition } from '@ng-forge/dynamic-forms';
import {
  valueFieldMapper,
  checkboxFieldMapper,
  optionsFieldMapper,
  datepickerFieldMapper,
  submitButtonFieldMapper,
} from '@ng-forge/dynamic-forms/integration';

export function withSpartanFields(): FieldTypeDefinition[] {
  return [
    {
      name: 'input',
      loadComponent: () => import('./fields/input/hlm-input.component'),
      mapper: valueFieldMapper,
      propsToMeta: ['type'],
    },
    {
      name: 'textarea',
      loadComponent: () => import('./fields/textarea/hlm-textarea.component'),
      mapper: valueFieldMapper,
      propsToMeta: ['rows'],
    },
    {
      name: 'checkbox',
      loadComponent: () => import('./fields/checkbox/hlm-checkbox.component'),
      mapper: checkboxFieldMapper,
    },
    {
      name: 'toggle',
      loadComponent: () => import('./fields/toggle/hlm-toggle.component'),
      mapper: checkboxFieldMapper,
    },
    {
      name: 'select',
      loadComponent: () => import('./fields/select/hlm-select.component'),
      mapper: optionsFieldMapper,
    },
    {
      name: 'radio',
      loadComponent: () => import('./fields/radio/hlm-radio.component'),
      mapper: optionsFieldMapper,
    },
    {
      name: 'slider',
      loadComponent: () => import('./fields/slider/hlm-slider.component'),
      mapper: valueFieldMapper,
    },
    {
      name: 'datepicker',
      loadComponent: () => import('./fields/datepicker/hlm-datepicker.component'),
      mapper: datepickerFieldMapper,
    },
    {
      name: 'submit',
      loadComponent: () => import('./fields/button/hlm-button.component'),
      mapper: submitButtonFieldMapper,
    },
  ];
}

declare module '@ng-forge/dynamic-forms' {
  interface FieldRegistryLeaves {
    input: import('./fields/input/hlm-input.type').HlmInputField;
    textarea: import('./fields/textarea/hlm-textarea.type').HlmTextareaField;
    checkbox: import('./fields/checkbox/hlm-checkbox.type').HlmCheckboxField;
    toggle: import('./fields/toggle/hlm-toggle.type').HlmToggleField;
    select: import('./fields/select/hlm-select.type').HlmSelectField<unknown>;
    radio: import('./fields/radio/hlm-radio.type').HlmRadioField<unknown>;
    slider: import('./fields/slider/hlm-slider.type').HlmSliderField;
    datepicker: import('./fields/datepicker/hlm-datepicker.type').HlmDatepickerField;
    submit: import('./fields/button/hlm-button.type').HlmSubmitButtonField;
  }
}
