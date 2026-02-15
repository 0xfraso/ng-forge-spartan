import { Component, computed, signal, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DynamicForm, FormConfig } from '@ng-forge/dynamic-forms';
import { standardSchema } from '@ng-forge/dynamic-forms/schema';
import { JsonPipe } from '@angular/common';
import { z } from 'zod';

const registrationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  bio: z.union([z.string(), z.undefined()]),
  newsletter: z.union([z.boolean(), z.undefined()]),
  notifications: z.union([z.boolean(), z.string(), z.undefined()]),
  country: z.union([z.string(), z.undefined()]),
  experience: z.union([z.enum(['beginner', 'intermediate', 'advanced', 'expert']), z.literal(''), z.undefined()]),
  volume: z.union([z.number(), z.literal(''), z.undefined()]),
  birthdate: z.union([z.string(), z.undefined()]),
});

const formConfig = {
  schema: standardSchema(registrationSchema),
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
      type: 'input',
      key: 'password',
      label: 'Password',
      props: {
        type: 'password',
        placeholder: 'Enter password',
        hint: 'Min 8 chars, uppercase, lowercase, and number required',
      },
    },
    {
      type: 'input',
      key: 'confirmPassword',
      label: 'Confirm Password',
      validators: [
        {
          type: 'custom',
          expression: 'fieldValue === formValue.password',
          kind: 'mismatch',
        },
      ],
      validationMessages: {
        mismatch: 'Passwords do not match',
      },
      props: { type: 'password', placeholder: 'Re-enter password', hint: 'Must match password' },
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
    {
      type: 'submit',
      key: 'submit',
      label: 'Register',
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

  private readonly dynamicForm = viewChild(DynamicForm);

  protected readonly fieldValidity = computed(() => {
    const form = this.dynamicForm();
    if (!form) return {};

    const fieldContext = form.fieldSignalContext();
    if (!fieldContext) return {};

    const formTree = fieldContext.form as unknown as Record<string, unknown>;
    const validity: Record<string, { valid: boolean; touched: boolean; dirty: boolean }> = {};

    const keys = ['name', 'email', 'password', 'confirmPassword', 'bio', 'newsletter', 'notifications', 'country', 'experience', 'volume', 'birthdate', 'submit'];

    for (const key of keys) {
      const field = formTree[key] as { (): { valid: () => boolean; touched: () => boolean; dirty: () => boolean } } | undefined;
      if (field && typeof field === 'function') {
        const state = field();
        validity[key] = {
          valid: state.valid(),
          touched: state.touched(),
          dirty: state.dirty(),
        };
      }
    }

    return validity;
  });

  protected readonly displayData = computed(() => ({
    value: this.formValue(),
    validity: this.fieldValidity(),
  }));
}
