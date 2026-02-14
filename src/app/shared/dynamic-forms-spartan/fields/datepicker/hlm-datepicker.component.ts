import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, input, signal } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';
import { HlmDatePickerImports } from '@hlm/date-picker';
import { DynamicText, DynamicTextPipe, ValidationMessages } from '@ng-forge/dynamic-forms';
import { FieldMeta } from '@ng-forge/dynamic-forms';
import { createResolvedErrorsSignal, setupMetaTracking, shouldShowErrors } from '@ng-forge/dynamic-forms/integration';
import { HlmDatepickerComponent, HlmDatepickerProps } from './hlm-datepicker.type';
import { AsyncPipe } from '@angular/common';

function toDate(value: Date | string | null | undefined): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? undefined : parsed;
}

@Component({
  selector: 'df-hlm-datepicker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmDatePickerImports, DynamicTextPipe, AsyncPipe],
  template: `
    @let f = field();
    @let pickerId = key() + '-datepicker';

    <div class="space-y-2">
      @if (label()) {
        <label [for]="pickerId" class="text-sm font-medium">{{ label() | dynamicText | async }}</label>
      }

      <hlm-date-picker
        [buttonId]="pickerId"
        [date]="_selectedDate()"
        [disabled]="f().disabled()"
        [min]="toDate(minDate())"
        [max]="toDate(maxDate())"
        [captionLayout]="props()?.captionLayout ?? 'label'"
        [autoCloseOnSelect]="props()?.autoCloseOnSelect ?? true"
        (dateChange)="_onDateChange($event)"
        [attr.aria-invalid]="ariaInvalid()"
        [attr.aria-required]="ariaRequired()"
        [attr.aria-describedby]="ariaDescribedBy()"
      >
        {{ placeholder() ?? 'Pick a date' }}
      </hlm-date-picker>

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
export default class HlmDatepickerFieldComponent implements HlmDatepickerComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly field = input.required<FieldTree<Date | string>>();
  readonly key = input.required<string>();

  readonly label = input<DynamicText>();
  readonly placeholder = input<DynamicText>();
  readonly className = input<string>('');
  readonly tabIndex = input<number>();
  readonly minDate = input<Date | string | null>();
  readonly maxDate = input<Date | string | null>();
  readonly startAt = input<Date | null>();
  readonly props = input<HlmDatepickerProps>();
  readonly meta = input<FieldMeta>();
  readonly validationMessages = input<ValidationMessages>();
  readonly defaultValidationMessages = input<ValidationMessages>();

  protected readonly _selectedDate = signal<Date | undefined>(undefined);
  protected readonly toDate = toDate;

  constructor() {
    setupMetaTracking(this.elementRef, this.meta, { selector: 'hlm-date-picker' });
  }

  protected readonly _syncFromField = effect(() => {
    const fieldValue = this.field()().value();
    const converted = toDate(fieldValue);
    if (converted !== undefined && converted.getTime() !== this._selectedDate()?.getTime()) {
      this._selectedDate.set(converted);
    }
  });

  protected _onDateChange(value: Date | null): void {
    if (value !== null) {
      this._selectedDate.set(value);
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
