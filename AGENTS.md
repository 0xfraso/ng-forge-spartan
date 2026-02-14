# ng-forge-spartan Project

## ng-forge Documentation Subtree

The `docs/ng-forge` directory contains the ng-forge source code as a git subtree for reference.

**Subtree remote**: https://github.com/ng-forge/ng-forge

### Updating the subtree

```bash
git subtree pull --prefix docs/ng-forge https://github.com/ng-forge/ng-forge main --squash
```

### Key References

- Custom integrations: `docs/ng-forge/packages/dynamic-forms-material/` (reference implementation)
- Integration API: `docs/ng-forge/packages/dynamic-forms/integration/`
- Core types: `@ng-forge/dynamic-forms`

## Dynamic Forms Spartan Integration

**Full Documentation**: `README.md`

Location: `src/app/shared/dynamic-forms-spartan/`

Provides ng-forge field components using Spartan UI (hlm-* components).

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
3. Register in `with-spartan-fields.ts`
4. Augment `FieldRegistryLeaves` in `with-spartan-fields.ts`
5. Export from `index.ts`

### Import Aliases (tsconfig.json)

```
@hlm/form-field, @hlm/input, @hlm/textarea, @hlm/checkbox, @hlm/switch,
@hlm/select, @hlm/radio-group, @hlm/slider, @hlm/date-picker, @hlm/label
```

## Build Commands

```bash
npm run build    # Production build
npm run start    # Dev server
npm run test     # Run tests
```
