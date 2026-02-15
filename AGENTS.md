# ng-forge-spartan Project

## ng-forge-spartan Library

**Full Documentation**: `README.md`

The main library providing ng-forge field components using Spartan UI (hlm-* components).

### Structure

```
libs/ng-forge-spartan/
├── src/
│   ├── index.ts                    # Public API exports
│   └── lib/
│       ├── with-spartan-fields.ts  # Provider registration + module augmentation
│       └── fields/
│           ├── input/
│           │   ├── hlm-input.type.ts
│           │   └── hlm-input.component.ts
│           ├── textarea/
│           ├── checkbox/
│           ├── toggle/
│           ├── select/
│           ├── radio/
│           ├── slider/
│           ├── datepicker/
│           └── button/
├── package.json                    # npm package metadata (name: ng-forge-spartan)
├── ng-package.json                 # ng-packagr configuration
└── tsconfig.*.json                 # TypeScript configuration

apps/example/                        # Example app demonstrating library usage
├── src/
│   ├── main.ts
│   ├── app/
│   └── styles.css
└── project.json
```

### Supported Field Types

| Type | Pattern | Notes |
|------|---------|-------|
| `input` | Native + `[formField]` | Uses hlm-form-field wrapper |
| `textarea` | Native + `[formField]` | Uses hlm-form-field wrapper |
| `select` | CVA + BrnFormFieldControl | brn-select with hlm-option |
| `checkbox` | CVA only | No hlm-form-field, manual layout |
| `toggle` | CVA only | hlm-switch, no hlm-form-field |
| `radio` | Manual value sync | [value] + (valueChange) pattern |
| `slider` | Manual value sync | [value] + (valueChange) pattern |
| `datepicker` | Manual value sync | Date conversion for strings |

### Integration Patterns Summary

1. **Native + Directive**: `[formField]` on native input/textarea with hlm styling
2. **CVA with BrnFormFieldControl**: `[formField]` + hlm-form-field (select)
3. **CVA without BrnFormFieldControl**: `[formField]` only, no hlm-form-field (checkbox, switch)
4. **Non-CVA Components**: Manual `[value]` + `(valueChange)` sync (radio, slider, datepicker)

### Adding New Field Types

1. Create type definition in `fields/{type}/hlm-{type}.type.ts`
2. Create component in `fields/{type}/hlm-{type}.component.ts`
3. Register in `lib/with-spartan-fields.ts`
4. Augment `FieldRegistryLeaves` in `lib/with-spartan-fields.ts`
5. Export from `lib/index.ts` and `src/index.ts`

### Import Aliases (tsconfig.json)

```
@hlm/form-field, @hlm/input, @hlm/textarea, @hlm/checkbox, @hlm/switch,
@hlm/select, @hlm/radio-group, @hlm/slider, @hlm/date-picker, @hlm/label
```

### External References

- **ng-forge**: https://github.com/ng-forge/ng-forge
- **ng-forge Reference Integration**: https://github.com/ng-forge/ng-forge/tree/main/packages/dynamic-forms-material
- **ng-forge Integration API**: https://github.com/ng-forge/ng-forge/tree/main/packages/dynamic-forms/integration

## Build Commands

```bash
npm run build:lib      # Build library for npm publishing
npm run start:example  # Run example app dev server
npm run build:example  # Build example app
npm run test           # Run tests
```
