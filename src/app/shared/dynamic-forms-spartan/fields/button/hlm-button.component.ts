import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { HlmButton } from '@hlm/button';
import {
  ARRAY_CONTEXT,
  ArrayItemContext,
  DynamicText,
  DynamicTextPipe,
  EventBus,
  FormEvent,
  FormEventConstructor,
  resolveTokens,
} from '@ng-forge/dynamic-forms';
import { EventArgs } from '@ng-forge/dynamic-forms/integration';
import { HlmButtonComponent, HlmButtonProps } from './hlm-button.type';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'df-hlm-button',
  imports: [HlmButton, DynamicTextPipe, AsyncPipe],
  host: {
    '[id]': '`${key()}`',
    '[attr.data-testid]': 'key()',
    '[class]': 'className()',
    '[attr.hidden]': 'hidden() || null',
  },
  template: `
    @let buttonId = key() + '-button';
    <button
      hlmBtn
      [id]="buttonId"
      [type]="buttonType()"
      [variant]="props()?.variant || 'default'"
      [size]="props()?.size || 'default'"
      [disabled]="disabled()"
      [attr.data-testid]="buttonTestId()"
      (click)="onClick()"
    >
      {{ label() | dynamicText | async }}
    </button>
  `,
  styles: [
    `
      button {
        min-width: fit-content;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HlmButtonFieldComponent<TEvent extends FormEvent> implements HlmButtonComponent<TEvent> {
  private readonly eventBus = inject(EventBus);
  private readonly arrayContext = inject(ARRAY_CONTEXT, { optional: true });

  readonly key = input.required<string>();
  readonly label = input.required<DynamicText>();
  readonly disabled = input<boolean>(false);
  readonly hidden = input<boolean>(false);

  readonly tabIndex = input<number>();
  readonly className = input<string>('');

  readonly event = input<FormEventConstructor<TEvent>>();
  readonly eventArgs = input<EventArgs>();
  readonly props = input<HlmButtonProps>();

  readonly eventContext = input<ArrayItemContext>();

  readonly buttonType = computed(() => this.props()?.type ?? 'button');

  readonly buttonTestId = computed(() => `${this.buttonType()}-${this.key()}`);

  onClick(): void {
    if (this.buttonType() === 'submit') {
      return;
    }

    const event = this.event();
    if (event) {
      this.dispatchEvent(event);
    }
  }

  private dispatchEvent(event: FormEventConstructor<TEvent>): void {
    const args = this.eventArgs();

    if (args && args.length > 0) {
      const context: ArrayItemContext = this.arrayContext
        ? {
            key: this.key(),
            index: this.arrayContext.index(),
            arrayKey: this.arrayContext.arrayKey,
            formValue: this.arrayContext.formValue,
          }
        : this.eventContext() || { key: this.key() };

      const resolvedArgs = resolveTokens(args, context);
      this.eventBus.dispatch(event, ...resolvedArgs);
    } else {
      this.eventBus.dispatch(event);
    }
  }
}
