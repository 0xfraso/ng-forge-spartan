import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input } from '@angular/core';
import { FormField, FieldTree } from '@angular/forms/signals';
import { HlmFormField, HlmError, HlmHint } from '@hlm/form-field';
import { HlmLabel } from '@hlm/label';
import {
  HlmSelectImports,
} from '@hlm/select';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { DynamicText, DynamicTextPipe, FieldMeta, FieldOption, ValidationMessages, ValueType } from '@ng-forge/dynamic-forms';
import { createResolvedErrorsSignal, setupMetaTracking, shouldShowErrors } from '@ng-forge/dynamic-forms/integration';
import { HlmSelectComponent, HlmSelectProps } from './hlm-select.type';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'df-hlm-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HlmFormField,
    HlmLabel,
    HlmError,
    HlmHint,
    HlmSelectImports,
    BrnSelectImports,
    FormField,
    DynamicTextPipe,
    AsyncPipe,
  ],
  template: `
    @let f = field();
    @let selectId = key() + '-select';

    <hlm-form-field>
      @if (label()) {
        <label [for]="selectId" hlmLabel>{{ label() | dynamicText | async }}</label>
      }

      <brn-select
        [id]="selectId"
        [formField]="f"
        [placeholder]="(placeholder() | dynamicText | async) ?? ''"
        [multiple]="props()?.multiple ?? false"
        [attr.aria-invalid]="ariaInvalid()"
        [attr.aria-required]="ariaRequired()"
        [attr.aria-describedby]="ariaDescribedBy()"
      >
        <hlm-select-trigger class="w-full">
          <hlm-select-value />
        </hlm-select-trigger>

        <hlm-select-content>
          @for (option of options(); track option.value) {
            <hlm-option [value]="option.value" [disabled]="option.disabled ?? false">
              {{ option.label | dynamicText | async }}
            </hlm-option>
          }
        </hlm-select-content>
      </brn-select>

      @if (errorsToDisplay()[0]; as error) {
        <hlm-error [id]="errorId()">{{ error.message }}</hlm-error>
      } @else if (props()?.hint; as hint) {
        <hlm-hint [id]="hintId()">{{ hint | dynamicText | async }}</hlm-hint>
      }
    </hlm-form-field>
  `,
  host: {
    '[id]': 'key()',
    '[attr.data-testid]': 'key()',
    '[class]': 'className()',
    '[attr.hidden]': 'field()().hidden() || null',
  },
})
export default class HlmSelectFieldComponent implements HlmSelectComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly field = input.required<FieldTree<ValueType>>();
  readonly key = input.required<string>();

  readonly label = input<DynamicText>();
  readonly placeholder = input<DynamicText>();
  readonly className = input<string>('');
  readonly tabIndex = input<number>();
  readonly options = input<FieldOption<ValueType>[]>([]);
  readonly props = input<HlmSelectProps>();
  readonly meta = input<FieldMeta>();
  readonly validationMessages = input<ValidationMessages>();
  readonly defaultValidationMessages = input<ValidationMessages>();

  constructor() {
    setupMetaTracking(this.elementRef, this.meta, { selector: 'brn-select' });
  }

  readonly resolvedErrors = createResolvedErrorsSignal(
    this.field,
    this.validationMessages,
    this.defaultValidationMessages,
  );
  readonly showErrors = shouldShowErrors(this.field);

  readonly errorsToDisplay = computed(() => (this.showErrors() ? this.resolvedErrors() : []));

  protected readonly hintId = computed(() => `${this.key()}-hint`);
  protected readonly errorId = computed(() => `${this.key()}-error`);

  protected readonly ariaInvalid = computed(() => {
    const fieldState = this.field()();
    return fieldState.invalid() && fieldState.touched();
  });

  protected readonly ariaRequired = computed(() => {
    return this.field()().required?.() === true ? true : null;
  });

  protected readonly ariaDescribedBy = computed(() => {
    if (this.errorsToDisplay().length > 0) {
      return this.errorId();
    }
    if (this.props()?.hint) {
      return this.hintId();
    }
    return null;
  });
}
