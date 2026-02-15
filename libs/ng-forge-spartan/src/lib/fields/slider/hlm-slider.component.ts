import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, input, signal } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';
import { HlmError, HlmHint } from '@hlm/form-field';
import { HlmLabel } from '@hlm/label';
import { HlmSliderImports } from '@hlm/slider';
import { DynamicText, DynamicTextPipe, ValidationMessages } from '@ng-forge/dynamic-forms';
import { FieldMeta } from '@ng-forge/dynamic-forms';
import { createResolvedErrorsSignal, setupMetaTracking, shouldShowErrors } from '@ng-forge/dynamic-forms/integration';
import { HlmSliderComponent, HlmSliderProps } from './hlm-slider.type';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'df-hlm-slider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmLabel, HlmSliderImports, DynamicTextPipe, AsyncPipe],
  template: `
    @let f = field();
    @let sliderId = key() + '-slider';

    <div class="space-y-2">
      @if (label()) {
        <label [for]="sliderId" hlmLabel class="block">{{ label() | dynamicText | async }}</label>
      }

      <hlm-slider
        [id]="sliderId"
        [value]="_sliderValue()"
        [min]="minValue() ?? 0"
        [max]="maxValue() ?? 100"
        [step]="step() ?? 1"
        [showTicks]="props()?.showTicks ?? false"
        [disabled]="f().disabled()"
        (valueChange)="_onSliderChange($event)"
        [attr.aria-invalid]="ariaInvalid()"
        [attr.aria-required]="ariaRequired()"
        [attr.aria-describedby]="ariaDescribedBy()"
        class="w-full"
      />

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
export default class HlmSliderFieldComponent implements HlmSliderComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly field = input.required<FieldTree<number>>();
  readonly key = input.required<string>();

  readonly label = input<DynamicText>();
  readonly placeholder = input<DynamicText>();
  readonly className = input<string>('');
  readonly tabIndex = input<number>();
  readonly minValue = input<number>();
  readonly maxValue = input<number>();
  readonly step = input<number>();
  readonly props = input<HlmSliderProps>();
  readonly meta = input<FieldMeta>();
  readonly validationMessages = input<ValidationMessages>();
  readonly defaultValidationMessages = input<ValidationMessages>();

  protected readonly _sliderValue = signal<number>(0);

  constructor() {
    setupMetaTracking(this.elementRef, this.meta, { selector: 'hlm-slider' });

    effect(() => {
      const fieldValue = this.field()().value();
      if (fieldValue !== undefined && fieldValue !== this._sliderValue()) {
        this._sliderValue.set(fieldValue);
      }
    });
  }

  protected _onSliderChange(value: number): void {
    this._sliderValue.set(value);
    this.field()().value.set(value);
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
