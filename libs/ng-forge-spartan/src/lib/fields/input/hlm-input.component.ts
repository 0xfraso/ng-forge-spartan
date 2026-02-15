import { afterRenderEffect, ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, viewChild } from '@angular/core';
import { FormField, FieldTree } from '@angular/forms/signals';
import { HlmFormField, HlmError, HlmHint } from '@hlm/form-field';
import { HlmLabel } from '@hlm/label';
import { HlmInput } from '@hlm/input';
import { DynamicText, DynamicTextPipe, ValidationMessages } from '@ng-forge/dynamic-forms';
import { createResolvedErrorsSignal, InputMeta, setupMetaTracking, shouldShowErrors } from '@ng-forge/dynamic-forms/integration';
import { HlmInputComponent, HlmInputProps } from './hlm-input.type';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'df-hlm-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmFormField, HlmLabel, HlmInput, HlmError, HlmHint, FormField, DynamicTextPipe, AsyncPipe],
  template: `
    @let f = field();
    @let inputId = key() + '-input';

    <hlm-form-field>
      @if (label()) {
        <label [for]="inputId" hlmLabel>{{ label() | dynamicText | async }}</label>
      }

      <input
        #inputRef
        hlmInput
        [id]="inputId"
        [formField]="f"
        [type]="props()?.type ?? 'text'"
        [placeholder]="(placeholder() | dynamicText | async) ?? ''"
        [attr.tabindex]="tabIndex()"
        [attr.aria-invalid]="ariaInvalid()"
        [attr.aria-required]="ariaRequired()"
        [attr.aria-describedby]="ariaDescribedBy()"
      />

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
export default class HlmInputFieldComponent implements HlmInputComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly field = input.required<FieldTree<string>>();
  readonly key = input.required<string>();

  readonly label = input<DynamicText>();
  readonly placeholder = input<DynamicText>();
  readonly className = input<string>('');
  readonly tabIndex = input<number>();
  readonly props = input<HlmInputProps>();
  readonly meta = input<InputMeta>();
  readonly validationMessages = input<ValidationMessages>();
  readonly defaultValidationMessages = input<ValidationMessages>();

  constructor() {
    setupMetaTracking(this.elementRef, this.meta, { selector: 'input' });
  }

  private readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('inputRef');

  private readonly isReadonly = computed(() => this.field()().readonly());

  private readonly syncReadonlyToDom = afterRenderEffect({
    write: () => {
      const inputRef = this.inputRef();
      const isReadonly = this.isReadonly();

      if (inputRef?.nativeElement) {
        if (isReadonly) {
          inputRef.nativeElement.setAttribute('readonly', '');
        } else {
          inputRef.nativeElement.removeAttribute('readonly');
        }
      }
    },
  });

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
