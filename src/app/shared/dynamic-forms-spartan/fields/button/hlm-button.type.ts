import { ButtonField, EventArgs } from '@ng-forge/dynamic-forms/integration';
import {
  AppendArrayItemEvent,
  ArrayAllowedChildren,
  FieldComponent,
  FormEvent,
  InsertArrayItemEvent,
  NextPageEvent,
  PopArrayItemEvent,
  PrependArrayItemEvent,
  PreviousPageEvent,
  RemoveAtIndexEvent,
  ShiftArrayItemEvent,
} from '@ng-forge/dynamic-forms';

export interface HlmButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg';
  type?: 'button' | 'submit' | 'reset';
}

export type HlmButtonField<TEvent extends FormEvent> = ButtonField<HlmButtonProps, TEvent>;
export type HlmButtonComponent<TEvent extends FormEvent> = FieldComponent<HlmButtonField<TEvent>>;

export type HlmSubmitButtonField = Omit<HlmButtonField<SubmitEvent>, 'event' | 'type' | 'eventArgs'> & {
  type: 'submit';
};

export type HlmNextButtonField = Omit<HlmButtonField<NextPageEvent>, 'event' | 'type' | 'eventArgs'> & {
  type: 'next';
};

export type HlmPreviousButtonField = Omit<HlmButtonField<PreviousPageEvent>, 'event' | 'type' | 'eventArgs'> & {
  type: 'previous';
};

export type AddArrayItemButtonField = Omit<HlmButtonField<AppendArrayItemEvent>, 'event' | 'type' | 'eventArgs'> & {
  type: 'addArrayItem';
  arrayKey?: string;
  template: ArrayAllowedChildren | readonly ArrayAllowedChildren[];
};

export type PrependArrayItemButtonField = Omit<HlmButtonField<PrependArrayItemEvent>, 'event' | 'type' | 'eventArgs'> & {
  type: 'prependArrayItem';
  arrayKey?: string;
  template: ArrayAllowedChildren | readonly ArrayAllowedChildren[];
};

export type InsertArrayItemButtonField = Omit<HlmButtonField<InsertArrayItemEvent>, 'event' | 'type' | 'eventArgs'> & {
  type: 'insertArrayItem';
  arrayKey?: string;
  index: number;
  template: ArrayAllowedChildren | readonly ArrayAllowedChildren[];
};

export type RemoveArrayItemButtonField = Omit<HlmButtonField<RemoveAtIndexEvent>, 'event' | 'type' | 'eventArgs'> & {
  type: 'removeArrayItem';
  arrayKey?: string;
};

export type PopArrayItemButtonField = Omit<HlmButtonField<PopArrayItemEvent>, 'event' | 'type' | 'eventArgs'> & {
  type: 'popArrayItem';
  arrayKey: string;
};

export type ShiftArrayItemButtonField = Omit<HlmButtonField<ShiftArrayItemEvent>, 'event' | 'type' | 'eventArgs'> & {
  type: 'shiftArrayItem';
  arrayKey: string;
};
