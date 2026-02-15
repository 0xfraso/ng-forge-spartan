import { DynamicText, ValueFieldComponent } from '@ng-forge/dynamic-forms';
import { TextareaField, TextareaMeta, TextareaProps } from '@ng-forge/dynamic-forms/integration';

export interface HlmTextareaProps extends TextareaProps {
  hint?: DynamicText;
}

export type HlmTextareaField = TextareaField<HlmTextareaProps>;

export type HlmTextareaComponent = ValueFieldComponent<HlmTextareaField>;

export type { TextareaMeta };
