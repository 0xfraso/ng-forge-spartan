import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DynamicForm, FormConfig } from '@ng-forge/dynamic-forms';
import { JsonPipe } from '@angular/common';

const formConfig = {
  fields: [
    {
      type: 'input',
      key: 'name',
      label: 'Name',
      props: { placeholder: 'Enter your name', hint: 'Your full name' },
    },
    {
      type: 'input',
      key: 'email',
      label: 'Email',
      props: { type: 'email', placeholder: 'you@example.com' },
    },
    {
      type: 'textarea',
      key: 'bio',
      label: 'Bio',
      props: { placeholder: 'Tell us about yourself', hint: 'Brief description', rows: 4 },
    },
    {
      type: 'checkbox',
      key: 'newsletter',
      label: 'Subscribe to newsletter',
      props: { hint: 'Get updates via email' },
    },
    {
      type: 'toggle',
      key: 'notifications',
      label: 'Enable notifications',
      props: { hint: 'Receive push notifications' },
    },
    {
      type: 'select',
      key: 'country',
      label: 'Country',
      options: [
        { label: 'United States', value: 'us' },
        { label: 'Canada', value: 'ca' },
        { label: 'United Kingdom', value: 'uk' },
        { label: 'Germany', value: 'de' },
        { label: 'France', value: 'fr' },
      ],
      props: { placeholder: 'Select your country' },
    },
    {
      type: 'radio',
      key: 'experience',
      label: 'Experience Level',
      options: [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' },
        { label: 'Expert', value: 'expert' },
      ],
      props: { hint: 'Select your experience level' },
    },
    {
      type: 'slider',
      key: 'volume',
      label: 'Volume',
      minValue: 0,
      maxValue: 100,
      step: 5,
      props: { hint: 'Adjust volume level', showTicks: false },
    },
    {
      type: 'datepicker',
      key: 'birthdate',
      label: 'Birth Date',
      props: { placeholder: 'Pick your birth date' },
    },
  ],
} as const satisfies FormConfig;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DynamicForm, JsonPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('ng-forge-spartan');
  protected readonly formConfig = formConfig;
  protected readonly formValue = signal<Record<string, unknown>>({});
}
