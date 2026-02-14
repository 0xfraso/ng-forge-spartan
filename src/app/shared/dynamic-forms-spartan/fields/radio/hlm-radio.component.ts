import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, input, signal } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';
import { HlmLabel } from '@hlm/label';
import { HlmRadioGroupImports } from '@hlm/radio-group';
import { BrnRadioGroupImports } from '@spartan-ng/brain/radio-group';
import { DynamicText, DynamicTextPipe, ValidationMessages, ValueType } from '@ng-forge/dynamic-forms';
import { FieldMeta, FieldOption } from '@ng-forge/dynamic-forms';
import { createResolvedErrorsSignal, setupMetaTracking, shouldShowErrors } from '@ng-forge/dynamic-forms/integration';
import { HlmRadioComponent, HlmRadioProps } from './hlm-radio.type';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'df-hlm-radio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmLabel, HlmRadioGroupImports, BrnRadioGroupImports, DynamicTextPipe, AsyncPipe],
  template: `
    @let f = field();
    @let groupId = key() + '-radio';

    <div class="space-y-2">
      @if (label()) {
        <label hlmLabel class="block">{{ label() | dynamicText | async }}</label>
      }

      <hlm-radio-group
        [id]="groupId"
        [value]="_selectedValue()"
        [disabled]="f().disabled()"
        (valueChange)="_onValueChange($event)"
        [attr.aria-invalid]="ariaInvalid()"
        [attr.aria-required]="ariaRequired()"
        [attr.aria-describedby]="ariaDescribedBy()"
      >
        @for (option of options(); track option.value) {
          <label class="flex items-center gap-x-3" [class.opacity-50]="option.disabled">
            <hlm-radio [value]="option.value" [disabled]="option.disabled ?? false" />
            <span class="text-sm">{{ option.label | dynamicText | async }}</span>
          </label>
        }
      </hlm-radio-group>

      @if (errorsToDisplay()[0]; as error) {
        <p class="text-sm text-destructive" [id]="errorId()">{{ error.message }}</p>
      } @else if (props()?.hint; as hint) {
        <p class="text-sm text-muted-foreground" [id]="hintId()">{{ hint | dynamicText | async }}</p>
      }
    </div>
  `,
  host: {
    '[id]': 'key()',
    '[attr.data-testid]': 'key()',
    '[class]': 'className()',
    '[attr.hidden]': 'field()().hidden() || null',
  },
})
export default class HlmRadioFieldComponent implements HlmRadioComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly field = input.required<FieldTree<ValueType>>();
  readonly key = input.required<string>();

  readonly label = input<DynamicText>();
  readonly placeholder = input<DynamicText>();
  readonly className = input<string>('');
  readonly tabIndex = input<number>();
  readonly options = input<FieldOption<ValueType>[]>([]);
  readonly props = input<HlmRadioProps>();
  readonly meta = input<FieldMeta>();
  readonly validationMessages = input<ValidationMessages>();
  readonly defaultValidationMessages = input<ValidationMessages>();

  protected readonly _selectedValue = signal<ValueType | undefined>(undefined);

  constructor() {
    setupMetaTracking(this.elementRef, this.meta, { selector: 'hlm-radio-group' });
  }

  protected readonly _syncFromField = effect(() => {
    const fieldValue = this.field()().value();
    if (fieldValue !== undefined && fieldValue !== this._selectedValue()) {
      this._selectedValue.set(fieldValue);
    }
  });

  protected _onValueChange(value: ValueType | undefined): void {
    if (value !== undefined) {
      this._selectedValue.set(value);
      this.field()().value.set(value);
    }
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
