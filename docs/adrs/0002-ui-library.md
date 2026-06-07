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
import * as Dialog from '@radix-ui/react-dialog';

<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Content>...</Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
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

## Evaluation Against Criteria

| Criteria                  | MUI        | Chakra UI  | Radix UI   | Mantine        | shadcn/ui      | **Base UI**    |
|---------------------------|------------|------------|------------|----------------|----------------|----------------|
| Minimal default theme     | ❌ Material | ⚠️ Opinionated | ✅ None    | ✅ Minimal      | ✅ Minimal      | ✅ None         |
| Easy customization        | ❌ Fights back | ✅ Good  | ✅ Total   | ✅ Granular API | ✅ Total (owned code) | ✅ Total   |
| Headless/migration path   | ❌ Very hard | ⚠️ Via Ark UI | ✅ Native | ✅ Built-in     | ✅ Already owned | ✅ Native      |
| No Tailwind               | ✅          | ⚠️ Panda CSS | ✅ (BYO)   | ✅ CSS Modules  | ❌ Tailwind-native | ✅ (BYO)    |
| Form utilities            | ⚠️ Basic    | ⚠️ Basic   | ❌ None    | ✅ @mantine/form | ❌ None (pair with RHF) | ❌ None  |
| Accessibility             | ✅          | ✅          | ✅          | ✅              | ✅ (via Radix)  | ✅              |
| Bundle size               | ❌ Heavy    | ⚠️ Medium  | ✅ Light   | ⚠️ Medium       | ✅ Pay-per-component | ✅ Light   |
| TypeScript support        | ✅          | ✅          | ✅          | ✅              | ✅              | ✅              |
| Vendor lock-in risk       | High        | Medium     | Very low   | Low            | None           | Very low        |
| Implementation effort     | Low         | Low        | High       | Low            | Medium         | High            |
| Maintenance effort        | Low         | Low        | Low        | Low            | Medium–High    | Low             |
| Component catalog         | ✅ Large    | ✅ Large   | ✅ Large   | ✅ Large        | ✅ Large        | ⚠️ Growing (25+)|

---

## Decision

**Use BaseUi**

Base UI seems like the best trade off between vendor opinions and implementation speed. Although we need to style from scratch (which may be a win in the long term), we'll own our theme and the styling tool. The primitives approach is the solution to our biggest pain of developping components from scratch.

**Mantime** is a strong contender, but the dependency on the tool may to high with time.

**shadcn/ui** dependency to tailwind is a huge deception, although we can take inspiration for the styling.

**Radix** has simialar pros as Base UI but maintenance seems to be lower now.

---

## Consequences

### Positive
- We own our styles
- Customisation is made easy with primitices and CSS custom properties
- Styling tool is up to us and not imposed by library
- Very low vendor lock-in; Base UI components are thin wrappers over standard DOM with clean accessibility semantics
- State-driven styling via data attributes keeps CSS expressive without JavaScript logic leaking into style files

### Negative
- Every component must be styled from scratch — higher upfront effort than a pre-styled library
- Smaller component catalog (25+ today) means some components may need to be built from primitives or hooks directly
- No built-in form utilities — must rely on React Hook Form (already decided in the companion forms ADR)
- Smaller community and fewer third-party resources than Mantine or MUI

### Tradeoffs
- We accept higher initial styling effort in exchange for a clean, unencumbered foundation with no future migration cost

---

## Implementation Plan

1. Install library
1. Confront with base form component and RHF
1. Confirm custom components with date picker example

---

## Open Questions
- Shall the library be consumed through proxy components?
