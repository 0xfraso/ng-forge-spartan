import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input } from '@angular/core';
import { FormField, FieldTree } from '@angular/forms/signals';
import { HlmLabel } from '@hlm/label';
import { HlmSwitch } from '@hlm/switch';
import { DynamicText, DynamicTextPipe, ValidationMessages } from '@ng-forge/dynamic-forms';
import { FieldMeta } from '@ng-forge/dynamic-forms';
import { createResolvedErrorsSignal, setupMetaTracking, shouldShowErrors } from '@ng-forge/dynamic-forms/integration';
import { HlmToggleComponent, HlmToggleProps } from './hlm-toggle.type';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'df-hlm-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmLabel, HlmSwitch, FormField, DynamicTextPipe, AsyncPipe],
  template: `
    @let f = field();
    @let switchId = key() + '-switch';

    <div class="space-y-2">
      <div class="flex items-center gap-3">
        <hlm-switch
          [id]="switchId"
          [formField]="f"
          [attr.aria-invalid]="ariaInvalid()"
          [attr.aria-required]="ariaRequired()"
          [attr.aria-describedby]="ariaDescribedBy()"
        />
        @if (label()) {
          <label [for]="switchId" hlmLabel class="cursor-pointer">{{ label() | dynamicText | async }}</label>
        }
      </div>

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
export default class HlmToggleFieldComponent implements HlmToggleComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly field = input.required<FieldTree<boolean>>();
  readonly key = input.required<string>();

  readonly label = input<DynamicText>();
  readonly placeholder = input<DynamicText>();
  readonly className = input<string>('');
  readonly tabIndex = input<number>();
  readonly props = input<HlmToggleProps>();
  readonly meta = input<FieldMeta>();
  readonly validationMessages = input<ValidationMessages>();
  readonly defaultValidationMessages = input<ValidationMessages>();

  constructor() {
    setupMetaTracking(this.elementRef, this.meta, { selector: 'hlm-switch' });
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
