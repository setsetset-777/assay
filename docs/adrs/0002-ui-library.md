# 0002: UI React Library

- Status: Proposed
- Date: 2026-05-21
- Author: Loïc Hamet

---

## Context

We are developping / maintaining an application with heavy usage of form inputs. We know from experience that form UI can be painful to build form scratch. To this effect we are looking into existing libraries in order to ease and speed up development.

---

## Goal

Implement an existing library which will be the base of the application's UI and from which a new library, custom or third party, can be built in the future.

---

## Constraints

1. **Easy Customization**: The library must allow granular control over component styling and behavior to fit a custom design system.
1. **Migration Path**: It must facilitate an easy migration to a fully custom, headless design system in the future.
1. **White label UI**: UI may be styled according to clients' brands.

### Bonus

The following constraints are to be considered but shouldn't be deal breakers.

1. **No TailwindCSS**: My personal taste would lean towards a library not using TailwindCSS:

- Heavy maintenance: Major upgrades from tailwind can be complicated and demand a high effort.
- Limited features: Although Tailwind cover a lot of features, some are not covered and must be implemented via CSS anyway.

1. **Theme**: A minmal theme is available.

---

## Options Considered

### Option 1: Material UI (MUI)

**Repository:** https://github.com/mui/material-ui
**Documentation:** https://mui.com/

A battle-tested, enterprise-grade React component library implementing Google's Material Design.

```tsx
import { TextField, Button } from '@mui/material';

<TextField label="First Name" variant="outlined" />
<Button variant="contained">Submit</Button>
```

✅ Pros

- Enormous ecosystem and community (6.7M+ weekly npm downloads)
- Comprehensive component catalog including advanced data grids, date pickers
- Strong TypeScript support

🛑 Cons

- Heavily branded with Material Design — diverging from it requires fighting the system
- CSS-in-JS (Emotion) adds runtime overhead
- High vendor lock-in risk; difficult to migrate away from

---

### Option 2: Chakra UI

**Repository:** https://github.com/chakra-ui/chakra-ui
**Documentation:** https://chakra-ui.com/

A modular, accessible component library. v3 (released late 2024) was a full rewrite, moving to Panda CSS and Ark UI (Zag.js state machines) for component logic.

```tsx
import { Input, Button } from '@chakra-ui/react';

<Input placeholder="First Name" />
<Button colorScheme="blue">Submit</Button>
```

✅ Pros

- Excellent accessibility out of the box (WCAG-compliant)
- Style props API for quick inline customization
- v3 is built on Ark UI primitives — a clean headless layer underneath

🛑 Cons

- The v2 → v3 rewrite was breaking; migration between major versions is costly
- Panda CSS (v3 styling engine) is a relatively new tool with its own learning curve
- Somewhat opinionated default aesthetics

---

### Option 3: Radix UI

**Repository:** https://github.com/radix-ui/primitives
**Documentation:** https://www.radix-ui.com/

A low-level, headless component library providing accessible, unstyled primitives (Dialog, Tooltip, Tabs, etc.). Bring your own styles.

```tsx
import * as Dialog from "@radix-ui/react-dialog";

<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Content>...</Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>;
```

✅ Pros

- Fully unstyled — zero design opinions, maximum visual freedom
- Best-in-class accessibility primitives (full ARIA + keyboard support)
- Very low vendor lock-in; logic and style are completely decoupled
- Small bundle footprint (40–80 KB with custom styling)

🛑 Cons

- No default styles at all — requires building every visual from scratch, even for prototyping
- Higher upfront implementation effort (2–3x more styling code vs. Mantine/Chakra)
- No built-in form management utilities
- Maintenance seem to have slow down since acqusition by WorkOs (shadcn now support base ui beside radix)

---

### Option 4: Mantine

**Repository:** https://github.com/mantinedev/mantine
**Documentation:** https://mantine.dev/

A comprehensive React component library (100+ components, 50+ hooks) with a minimal, non-opinionated default aesthetic. Since v7, it uses CSS Modules as the recommended styling mechanism and exposes a full headless mode.

```tsx
import { TextInput, Button } from '@mantine/core';

<TextInput label="First Name" placeholder="Enter first name" />
<Button variant="filled">Submit</Button>
```

✅ Pros

- Minimal default theme — functional but not strongly branded
- CSS Modules by default — no runtime CSS-in-JS overhead, plain CSS skills transfer directly
- **Headless mode built-in**: omitting `@mantine/*/styles.css` turns every component into an unstyled primitive; styles can be applied via the Styles API with any styling solution
- Granular `classNames` and `styles` props allow targeting internal component slots (e.g. `Input.label`, `Input.input`, `Input.wrapper`) without overriding globally
- Built-in `@mantine/form` with validation, dirty state, and error messages
- 50+ utility hooks included (`useClickOutside`, `useDebouncedValue`, etc.)
- Active maintenance with full-time contributors
- Strong TypeScript support

🛑 Cons

- Larger bundle than a pure headless library (~120 KB for full imports), though tree-shakeable
- Migration between major versions (e.g. v6 → v7) has historically required non-trivial effort due to the CSS-in-JS → CSS Modules shift
- A full headless migration (dropping all Mantine styles) disables some layout-dependent components (`Grid`, `SimpleGrid`, etc.) and theme-based props (`color`, `radius`, `size`)

---

### Option 5: shadcn/ui

**Repository:** https://github.com/shadcn-ui/ui
**Documentation:** https://ui.shadcn.com/

Not a component library in the traditional sense — a CLI-based, copy-paste component collection built on Radix UI (or Base UI since 2025) primitives and styled with Tailwind CSS. Running the CLI writes component source files directly into your repository.

```tsx
// After: npx shadcn-ui@latest add button input
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

<Input placeholder="First Name" />
<Button>Submit</Button>
```

✅ Pros

- **Zero vendor lock-in**: we own every line of component code from day one — no dependency to migrate away from
- **Total customization**: since the code lives in our repo, every internal detail (markup, styles, behavior) is freely editable
- Clean, minimal default aesthetic — neutral and not branded
- Built on Radix/Base UI primitives — full accessibility without extra effort
- Massive community (75,000+ GitHub stars, most-starred React UI project three years running)
- Upstream improvements can be selectively pulled in via the CLI

🛑 Cons

- **Tailwind CSS is the styling backbone**: component files are written entirely in Tailwind utility classes; replacing Tailwind with CSS Modules would mean rewriting every component
- **No upstream propagation**: bug fixes and improvements from shadcn are not automatically applied — the team must manually re-pull or patch components
- Copy-paste architecture is a higher maintenance responsibility than a versioned dependency
- No built-in form utilities — requires pairing with React Hook Form or similar
- Neutral defaults still require significant effort to build a cohesive, custom-branded UI

---

### Option 6: Base UI

**Repository:** https://github.com/mui/base-ui
**Documentation:** https://base-ui.com/

A headless React component library maintained by the MUI team with full-time engineers. Extracted from Material UI, it ships components with zero default styles — providing only behaviour, accessibility, and structure. Supports any styling solution (plain CSS, CSS Modules, Tailwind, Emotion, etc.) and exposes internal component state via data attributes and render props for fine-grained style control.

```tsx
import { Field } from '@base-ui-components/react/field';
import { Input } from '@base-ui-components/react/input';
import { Button } from '@base-ui-components/react/button';

<Field.Root>
  <Field.Label>First Name</Field.Label>
  <Input placeholder="Enter first name" className={styles.input} />
  <Field.Error />
</Field.Root>
<Button className={styles.button}>Submit</Button>
```

✅ Pros

- Fully unstyled — complete visual freedom with any styling solution including plain CSS Modules
- Backed by MUI's full-time engineering team; more actively maintained than Radix UI (which slowed after its WorkOS acquisition)
- Components expose internal state via data attributes (`data-checked`, `data-disabled`, etc.) and state-based `className`/`style` functions, making state-driven styling straightforward without extra wrappers
- Familiar API for anyone with MUI experience; also now available as the primitive layer under shadcn/ui
- Strong TypeScript support and clean, well-documented API
- No dependency on any styling library — styling solution is entirely the team's choice

🛑 Cons

- No default styles at all — like Radix, requires building every visual from scratch; high upfront effort for early-stage development
- Component catalog is still growing (25+ components), smaller than Mantine's 100+
- No built-in form utilities — must pair with React Hook Form or similar
- Relatively new as a standalone library; ecosystem and community are smaller than Radix or Mantine

---

### Option 7: React Aria Components

**Repository:** https://github.com/adobe/react-spectrum (monorepo, package `react-aria-components`)
**Documentation:** https://react-aria.adobe.com/

An unstyled React component library from Adobe, built on top of the `react-aria` and `react-stately` hooks. It ships behaviour, accessibility, internationalization and form validation with no default styles. Components expose a default class name (`react-aria-ComponentName`) and their state through data attributes (`data-focused`, `data-invalid`, `data-pressed`, etc.), as well as `className` functions, so any styling solution works, including plain CSS and CSS Modules.

```tsx
import {
  Form,
  TextField,
  Label,
  Input,
  FieldError,
  Button,
} from "react-aria-components";

<Form>
  <TextField name="firstName" isRequired>
    <Label>First Name</Label>
    <Input className={styles.input} placeholder="Enter first name" />
    <FieldError />
  </TextField>
  <Button type="submit" className={styles.button}>
    Submit
  </Button>
</Form>;
```

✅ Pros

- Fully unstyled — complete visual freedom with plain CSS Modules; state-driven styling via data attributes
- Largest unstyled catalog of the options considered (50+ components), including DateField, DatePicker, DateRangePicker, Calendar, TimeField, NumberField, ComboBox and TagGroup — the components that are costly to build from primitives
- Strong accessibility, keyboard and touch/mouse/screen-reader behaviour; internationalization built in (many locales and calendar systems, RTL, locale-aware number and date parsing)
- Built-in form validation (native or ARIA mode, custom `validate`, server errors) that can sit alongside React Hook Form
- Layered architecture: components are built on `react-aria` / `react-stately` hooks, which gives a lower-level path for a fully custom headless design system later
- Optional starting points for styling: vanilla CSS starter kits and copy-paste examples, which can be installed via the shadcn CLI (`@react-aria/css` registry) without Tailwind
- No dependency on any styling library
- Backed by Adobe, with a large, actively used codebase

🛑 Cons

- No default styles — the official example theme is a usable baseline for prototyping but is recognizably "Adobe" and would need restyling before client-facing use
- Has its own conventions (slots and context between child components, collection components such as Select/ComboBox/ListBox, render-prop `className`) — steeper learning curve than thin DOM wrappers like Base UI
- Coupling is higher than Base UI's thin DOM wrappers; the hooks layer is the escape hatch
- No form state management — must pair with React Hook Form or similar; integration needs care (`validationBehavior="aria"`, `inputRef` instead of `ref`, non-string values such as `DateValue` and numbers in the schema)
- Date/time components depend on `@internationalized/date`, which adds to the bundle where used
- Starter kits and examples are copied code: no upstream propagation of fixes into our copies

---

## Evaluation Against Criteria

## Evaluation Against Criteria

| Criteria                | MUI            | Chakra UI      | Radix UI  | Mantine          | shadcn/ui               | **Base UI**      | React Aria Components                       |
| ----------------------- | -------------- | -------------- | --------- | ---------------- | ----------------------- | ---------------- | ------------------------------------------- |
| Minimal default theme   | ❌ Material    | ⚠️ Opinionated | ✅ None   | ✅ Minimal       | ✅ Minimal              | ✅ None          | ✅ None                                     |
| Easy customization      | ❌ Fights back | ✅ Good        | ✅ Total  | ✅ Granular API  | ✅ Total (owned code)   | ✅ Total         | ✅ Total                                    |
| Headless/migration path | ❌ Very hard   | ⚠️ Via Ark UI  | ✅ Native | ✅ Built-in      | ✅ Already owned        | ✅ Native        | ✅ Native (hooks layer)                     |
| No Tailwind             | ✅             | ⚠️ Panda CSS   | ✅ (BYO)  | ✅ CSS Modules   | ❌ Tailwind-native      | ✅ (BYO)         | ✅ (BYO, vanilla CSS starter)               |
| Form utilities          | ⚠️ Basic       | ⚠️ Basic       | ❌ None   | ✅ @mantine/form | ❌ None (pair with RHF) | ❌ None          | ⚠️ Validation built in, no form state (RHF) |
| Accessibility           | ✅             | ✅             | ✅        | ✅               | ✅ (via Radix)          | ✅               | ✅                                          |
| Bundle size             | ❌ Heavy       | ⚠️ Medium      | ✅ Light  | ⚠️ Medium        | ✅ Pay-per-component    | ✅ Light         | ⚠️ Medium (date components add weight)      |
| TypeScript support      | ✅             | ✅             | ✅        | ✅               | ✅                      | ✅               | ✅                                          |
| Vendor lock-in risk     | High           | Medium         | Very low  | Low              | None                    | Very low         | Low                                         |
| Implementation effort   | Low            | Low            | High      | Low              | Medium                  | High             | Medium (starter kits help)                  |
| Maintenance effort      | Low            | Low            | Low       | Low              | Medium–High             | Low              | Low                                         |
| Component catalog       | ✅ Large       | ✅ Large       | ✅ Large  | ✅ Large         | ✅ Large                | ⚠️ Growing (25+) | ✅ Large (50+)                              |

---

## Decision

**Use React Aria Components, consumed through our own proxy components**

React Aria Components (RAC) gives the best trade-off between vendor opinions and implementation speed for an application dominated by form inputs. It is fully unstyled, so we own our theme and our styling tool (plain CSS / CSS Modules). Unlike Base UI, it already covers the inputs that are the most expensive to build from primitives (DateField, DatePicker, DateRangePicker, TimeField, NumberField, ComboBox, TagGroup), with built-in internationalization and form validation. Its layered architecture (`react-aria` / `react-stately` hooks under the components) provides the migration path to a fully custom headless design system.

All RAC components are wrapped in our own proxy components (`TextField`, `Select`, `DateField`, ...). Application code never imports from `react-aria-components` directly. This centralizes white-label styling and React Hook Form integration, and makes a later library swap a change in one place.

**Base UI** is the runner-up. It is lighter and closer to the DOM, but its catalog is smaller (25+ components) and, at the time of writing, it lacks date and time inputs. It remains the fallback if the date picker spike shows RAC is a poor fit.

**Mantine** is a strong contender, but the dependency on the tool may become too high over time.

**shadcn/ui**: its dependency on Tailwind is a major disappointment, although we can take inspiration for the styling.

**Radix** has similar pros to Base UI, but maintenance seems to have slowed down.

---

## Consequences

### Positive

- We own our styles
- Customization is made easy with unstyled components, data attributes and CSS custom properties
- Styling tool is up to us and not imposed by the library
- Date, time, number and combobox inputs are available without building them from scratch
- Accessibility, keyboard behavior and internationalization (locales, calendars, RTL) are handled by the library
- Low vendor lock-in; proxy components isolate the app from the library, and the hooks layer provides a path to a fully custom headless system
- State-driven styling via data attributes keeps CSS expressive without JavaScript logic leaking into style files
- Vanilla CSS starter kits and examples can be used as a baseline for prototyping

### Negative

- Every component must be styled from scratch, and the official example theme needs restyling before client-facing use
- Steeper learning curve than thin DOM wrappers: own conventions (slots and context, collection components, render-prop `className`)
- Higher coupling to the library's API than Base UI, mitigated by proxy components
- No form state management: must rely on React Hook Form (already decided in the companion forms ADR). Integration needs care (`validationBehavior="aria"`, `inputRef` instead of `ref`, non-string values such as `DateValue` in the schema)
- Date components depend on `@internationalized/date`, which adds to the bundle where used
- Copied starter code does not receive upstream fixes automatically
- Smaller community of third-party styled kits than MUI or Mantine

### Tradeoffs

- We accept higher initial styling effort and a larger API surface in exchange for a complete set of accessible form inputs and a clean, unencumbered foundation with a low future migration cost

---

## Implementation Plan

1. Install library
1. Confront with base form component and RHF
1. Confirm custom components with date picker example

---

## Open Questions

- Shall the library be consumed through proxy components?
