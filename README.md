# ng-forge Spartan

Spartan UI integration for ng-forge dynamic forms. Provides hlm-* field components with full type safety.

## Overview

This library bridges ng-forge's configuration-driven dynamic forms with Spartan UI components. It supports Angular Signal Forms for reactive state management with full type safety.

## Installation

```bash
npm install ng-forge-spartan
```

## Quick Start

```typescript
// app.config.ts
import { provideDynamicForm } from '@ng-forge/dynamic-forms';
import { withSpartanFields } from 'ng-forge-spartan';

export const appConfig: ApplicationConfig = {
  providers: [
    provideDynamicForm(...withSpartanFields()),
  ],
};
```

```typescript
// component.ts
import { DynamicForm, FormConfig } from '@ng-forge/dynamic-forms';

const formConfig = {
  fields: [
    { type: 'input', key: 'name', label: 'Name' },
    { type: 'select', key: 'country', label: 'Country', options: [...] },
  ],
} as const satisfies FormConfig;

@Component({
  template: `<form [dynamic-form]="formConfig" [(value)]="formValue" />`,
})
export class MyComponent {}
```

---

## Architecture

### Directory Structure

```
src/app/shared/dynamic-forms-spartan/
├── index.ts                    # Barrel exports
├── with-spartan-fields.ts      # Provider registration + module augmentation
└── fields/
    ├── input/
    │   ├── hlm-input.type.ts       # Type definitions
    │   └── hlm-input.component.ts  # Component implementation
    ├── textarea/
    ├── checkbox/
    ├── toggle/
    ├── select/
    ├── radio/
    ├── slider/
    └── datepicker/
```

### Key Files

| File | Purpose |
|------|---------|
| `with-spartan-fields.ts` | Registers field types with ng-forge, augments `FieldRegistryLeaves` |
| `hlm-{type}.type.ts` | Defines props interface and type aliases |
| `hlm-{type}.component.ts` | Component with default export for lazy loading |

---

## Integration Patterns

Spartan components require different integration patterns based on their underlying implementation:

### Pattern 1: Native Controls + `[formField]` Directive

**Components:** `input`, `textarea`

The `[formField]` directive from `@angular/forms/signals` works directly on native form elements with Spartan styling directives.

```typescript
// Template
<input
  hlmInput
  [formField]="field()"
  [type]="props()?.type ?? 'text'"
/>

// Imports
import { FormField, FieldTree } from '@angular/forms/signals';
import { HlmInput } from '@hlm/input';
```

**Key points:**
- `hlmInput` / `hlmTextarea` are directives that style native elements
- `[formField]` bridges signal forms to the native control
- Works with `hlm-form-field` wrapper for labels/hints/errors

### Pattern 2: CVA Components with BrnFormFieldControl

**Components:** `select` (brn-select)

Some Spartan brain components implement `BrnFormFieldControl`, enabling `[formField]` and `hlm-form-field` integration.

```typescript
// Template
<hlm-form-field>
  <brn-select [formField]="field()">
    <hlm-select-trigger>
      <hlm-select-value />
    </hlm-select-trigger>
    <hlm-select-content>
      @for (option of options(); track option.value) {
        <hlm-option [value]="option.value">{{ option.label }}</hlm-option>
      }
    </hlm-select-content>
  </brn-select>
</hlm-form-field>

// Imports
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@hlm/select';
```

**Key points:**
- `brn-select` (not `hlm-select`) accepts `[formField]`
- Uses `hlm-option` for options (not `hlm-select-option`)
- Compatible with `hlm-form-field` wrapper

### Pattern 3: CVA Components without BrnFormFieldControl

**Components:** `checkbox`, `toggle` (switch)

These components implement ControlValueAccessor but NOT BrnFormFieldControl. `[formField]` works, but `hlm-form-field` wrapper is incompatible.

```typescript
// Template - NO hlm-form-field wrapper
<div class="space-y-2">
  <div class="flex items-center gap-2">
    <hlm-checkbox [formField]="field()" />
    <label hlmLabel>{{ label() }}</label>
  </div>
  <!-- Manual error/hint styling -->
  @if (errorsToDisplay()[0]; as error) {
    <p class="text-sm text-destructive">{{ error.message }}</p>
  }
</div>

// Imports
import { HlmCheckbox } from '@hlm/checkbox';
import { HlmSwitch } from '@hlm/switch';
```

**Key points:**
- Cannot use `hlm-form-field` (requires `BrnFormFieldControl`)
- Manual styling for layout, errors, and hints
- Label placed inline with control

### Pattern 4: Non-CVA Components (Manual Value Sync)

**Components:** `radio`, `slider`, `datepicker`

These components do NOT implement ControlValueAccessor and cannot use `[formField]`. Value synchronization must be handled manually.

```typescript
// Component
protected readonly _selectedValue = signal<ValueType | undefined>(undefined);

protected readonly _syncFromField = effect(() => {
  const fieldValue = this.field()().value();
  if (fieldValue !== undefined && fieldValue !== this._selectedValue()) {
    this._selectedValue.set(fieldValue);
  }
});

protected _onValueChange(value: ValueType | undefined): void {
  this._selectedValue.set(value);
  this.field()().value.set(value);
}

// Template
<hlm-radio-group
  [value]="_selectedValue()"
  (valueChange)="_onValueChange($event)"
>
  @for (option of options(); track option.value) {
    <hlm-radio [value]="option.value" />
  }
</hlm-radio-group>
```

**Key points:**
- Use `[value]` + `(valueChange)` for two-way sync
- Requires local signal to track current value
- Effect syncs FROM form field TO component
- Event handler syncs FROM component TO form field

---

## Component Reference

### input

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `type` | `string` | `'text'` | Input type (text, email, password, etc.) |
| `placeholder` | `DynamicText` | - | Placeholder text |
| `hint` | `DynamicText` | - | Helper text below input |
| `label` | `DynamicText` | - | Label text |

```typescript
{
  type: 'input',
  key: 'email',
  label: 'Email Address',
  props: { type: 'email', placeholder: 'you@example.com', hint: 'We will never share your email' },
}
```

### textarea

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `rows` | `number` | `3` | Number of visible rows |
| `placeholder` | `DynamicText` | - | Placeholder text |
| `hint` | `DynamicText` | - | Helper text |

```typescript
{
  type: 'textarea',
  key: 'bio',
  label: 'Biography',
  props: { rows: 5, placeholder: 'Tell us about yourself' },
}
```

### checkbox

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `hint` | `DynamicText` | - | Helper text |
| `label` | `DynamicText` | - | Label text (renders inline) |

```typescript
{
  type: 'checkbox',
  key: 'terms',
  label: 'I agree to the terms and conditions',
  props: { hint: 'Required to continue' },
}
```

### toggle

Uses `hlm-switch` component.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `hint` | `DynamicText` | - | Helper text |
| `label` | `DynamicText` | - | Label text (renders inline) |

```typescript
{
  type: 'toggle',
  key: 'notifications',
  label: 'Enable notifications',
  props: { hint: 'Receive push notifications' },
}
```

### select

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `multiple` | `boolean` | `false` | Allow multiple selections |
| `placeholder` | `DynamicText` | - | Placeholder text |
| `hint` | `DynamicText` | - | Helper text |
| `options` | `FieldOption[]` | `[]` | Selectable options |

```typescript
{
  type: 'select',
  key: 'country',
  label: 'Country',
  options: [
    { label: 'United States', value: 'us' },
    { label: 'Canada', value: 'ca' },
    { label: 'United Kingdom', value: 'uk' },
  ],
  props: { placeholder: 'Select your country' },
}
```

### radio

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `hint` | `DynamicText` | - | Helper text |
| `options` | `FieldOption[]` | `[]` | Radio options |

```typescript
{
  type: 'radio',
  key: 'experience',
  label: 'Experience Level',
  options: [
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' },
  ],
}
```

### slider

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `minValue` | `number` | `0` | Minimum value |
| `maxValue` | `number` | `100` | Maximum value |
| `step` | `number` | `1` | Step increment |
| `showTicks` | `boolean` | `false` | Show tick marks |
| `hint` | `DynamicText` | - | Helper text |

```typescript
{
  type: 'slider',
  key: 'volume',
  label: 'Volume',
  minValue: 0,
  maxValue: 100,
  step: 5,
  props: { showTicks: true },
}
```

### datepicker

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `minDate` | `Date \| string` | - | Minimum selectable date |
| `maxDate` | `Date \| string` | - | Maximum selectable date |
| `placeholder` | `DynamicText` | `'Pick a date'` | Button text |
| `captionLayout` | `string` | `'label'` | Calendar header layout |
| `autoCloseOnSelect` | `boolean` | `true` | Close calendar on selection |
| `hint` | `DynamicText` | - | Helper text |

```typescript
{
  type: 'datepicker',
  key: 'birthdate',
  label: 'Birth Date',
  minDate: '1900-01-01',
  maxDate: new Date(),
  props: { placeholder: 'Select your birthday' },
}
```

---

## Adding New Field Types

### Step 1: Create Type Definition

```typescript
// fields/custom/hlm-custom.type.ts
import { DynamicText, ValueFieldComponent } from '@ng-forge/dynamic-forms';
import { ValueField } from '@ng-forge/dynamic-forms/integration';

export interface HlmCustomProps {
  hint?: DynamicText;
  customProp?: string;
}

export type HlmCustomField = ValueField<HlmCustomProps>;
export type HlmCustomComponent = ValueFieldComponent<HlmCustomField>;
```

### Step 2: Create Component

```typescript
// fields/custom/hlm-custom.component.ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';
import { HlmCustomComponent, HlmCustomProps } from './hlm-custom.type';

@Component({
  selector: 'df-hlm-custom',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  template: `...`,
})
export default class HlmCustomFieldComponent implements HlmCustomComponent {
  readonly field = input.required<FieldTree<string>>();
  readonly key = input.required<string>();
  readonly label = input<DynamicText>();
  readonly props = input<HlmCustomProps>();
  // ... other inputs
}
```

### Step 3: Register with Provider

```typescript
// with-spartan-fields.ts
export function withSpartanFields(): FieldTypeDefinition[] {
  return [
    // ... existing fields
    {
      name: 'custom',
      loadComponent: () => import('./fields/custom/hlm-custom.component'),
      mapper: valueFieldMapper, // or appropriate mapper
    },
  ];
}
```

### Step 4: Augment Type Registry

```typescript
// with-spartan-fields.ts
declare module '@ng-forge/dynamic-forms' {
  interface FieldRegistryLeaves {
    // ... existing types
    custom: import('./fields/custom/hlm-custom.type').HlmCustomField;
  }
}
```

### Step 5: Export from Barrel

```typescript
// index.ts
export * from './fields/custom/hlm-custom.type';
```

---

## Mappers Reference

Mappers transform form field config to component inputs. Import from `@ng-forge/dynamic-forms/integration`:

| Mapper | Use For | Provides |
|--------|---------|----------|
| `valueFieldMapper` | input, textarea, slider | `field`, `key`, `label`, `placeholder`, `className`, `tabIndex`, `props`, `meta`, `validationMessages`, `defaultValidationMessages` |
| `checkboxFieldMapper` | checkbox, toggle | Same as valueFieldMapper |
| `optionsFieldMapper` | select, radio | Same + `options` |
| `datepickerFieldMapper` | datepicker | Same as valueFieldMapper + `minDate`, `maxDate`, `startAt` |

---

## Validation & Error Display

All components include built-in validation display:

```typescript
// Standard error display pattern
readonly resolvedErrors = createResolvedErrorsSignal(
  this.field,
  this.validationMessages,
  this.defaultValidationMessages,
);

readonly showErrors = shouldShowErrors(this.field);

readonly errorsToDisplay = computed(() => 
  this.showErrors() ? this.resolvedErrors() : []
);
```

Errors display when:
1. Field is invalid
2. Field has been touched (user interaction)

---

## Accessibility

All components implement ARIA attributes:

```typescript
protected readonly ariaInvalid = computed(() => {
  const fieldState = this.field()();
  return fieldState.invalid() && fieldState.touched();
});

protected readonly ariaRequired = computed(() => {
  return this.field()().required?.() === true ? true : null;
});

protected readonly ariaDescribedBy = computed(() => {
  if (this.errorsToDisplay().length > 0) return this.errorId();
  if (this.props()?.hint) return this.hintId();
  return null;
});
```

---

## Import Aliases

Path aliases configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@hlm/form-field": ["./libs/ui/form-field/src/index.ts"],
      "@hlm/input": ["./libs/ui/input/src/index.ts"],
      "@hlm/textarea": ["./libs/ui/textarea/src/index.ts"],
      "@hlm/checkbox": ["./libs/ui/checkbox/src/index.ts"],
      "@hlm/switch": ["./libs/ui/switch/src/index.ts"],
      "@hlm/select": ["./libs/ui/select/src/index.ts"],
      "@hlm/radio-group": ["./libs/ui/radio-group/src/index.ts"],
      "@hlm/slider": ["./libs/ui/slider/src/index.ts"],
      "@hlm/date-picker": ["./libs/ui/date-picker/src/index.ts"],
      "@hlm/label": ["./libs/ui/label/src/index.ts"]
    }
  }
}
```

---

## Known Limitations

1. **Spartan + Signal Forms**: Spartan components use NgControl (reactive forms), not Angular Signal Forms. The `[formField]` directive bridges this gap for compatible components.

2. **hlm-form-field Compatibility**: Only works with components implementing `BrnFormFieldControl`:
   - Compatible: `brn-select`, native inputs with hlmInput
   - Not compatible: `hlm-checkbox`, `hlm-switch`, `hlm-radio-group`, `hlm-slider`, `hlm-date-picker`

3. **Readonly Handling**: Native controls require manual DOM manipulation for readonly attribute (see input/textarea components).

4. **Date Handling**: Datepicker uses manual value sync with `Date` object conversion for string values.

---

## Troubleshooting

### Error: "No provider for NgControl"
- Component doesn't support `[formField]` directive
- Use Pattern 4 (manual value sync) instead

### Error: "hlm-form-field requires BrnFormFieldControl"
- Component doesn't implement required interface
- Remove `hlm-form-field` wrapper, use manual layout

### Form value not updating
- Check that mapper provides correct inputs
- Verify two-way binding with `[(value)]` on form element

### Styles not applying
- Verify Tailwind CSS is configured
- Check that Spartan HLM imports are included
- Ensure component is standalone with correct imports

---

## References

- **ng-forge**: https://github.com/ng-forge/ng-forge
- **ng-forge Docs**: https://github.com/ng-forge/ng-forge/tree/main/packages/dynamic-forms
- **Reference Integration**: https://github.com/ng-forge/ng-forge/tree/main/packages/dynamic-forms-material
- **Spartan UI**: https://spartan.ng/
- **Spartan NG GitHub**: https://github.com/spartan-ng/spartan
- **Angular Signal Forms**: https://angular.dev/guide/forms/signals

---

## License

MIT
