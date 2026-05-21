# [ADR-0001] Configurable forms

- Status: Proposed
- Date: 2026-05-21
- Author: Loïc Hamet

---

## Context

A core feature of the app is the configuration of different forms to gather feedback from users regarding of clients' needs.

---

## Goal
- In the short term, render multi step forms from file configuration.
- In the long term, allow clients to configure forms from a visual interface.
- Allow white-label design for client customization.

---

## Constraints
- Customization: Styles are not tight to existing design systems like Material.
- Validation: Make validation easy and configurable
- Open source: Should not depend on external cloud services. Any centralised service should be self hostable, ideally dockerized.

---

## Options considered

### Option 1: SurveyJS

Documentation:
https://surveyjs.io/documentation

Repository:
https://github.com/surveyjs/survey-library

Description:
SurveyJS Proposes many prodcuts to handle forms inline:
- A form library for Angular, VUeJS, React, JS configurable via JSON schema.
- A survey creator widget generating JSON schemas.
- A dashboard to visualize survey data

Implementation example:
```js
import { Model } from 'survey-core';

const surveyJson = {
  elements: [{
    name: "FirstName",
    title: "Enter your first name:",
    type: "text"
  }, {
    name: "LastName",
    title: "Enter your last name:",
    type: "text"
  }]
}

export default function SurveyComponent() {
  const survey = new Model(surveyJson);

  survey.applyTheme({
    "cssVariables": {
        // ...
    },
    "themeName": "doubleborder",
    "colorPalette": "dark",
    "isPanelless": true
  });

  return "...";
}
````

✅ Pros
- E2E tool from visual creator to dashboard via React library

🛑 Cons
- Heavy tool
- Customisation only available via CSS properties
- Look and feel like Material

### Option 2: Form.io

Documentation:
https://form.io

Repository:
None

```js
Formio.createForm(document.getElementById('formio'), {
  components: [
  	{
      type: 'textfield',
      key: 'firstName',
      label: 'First Name'
    },
    {
    	type: 'textfield',
      key: 'lastName',
      label: 'Last Name'
    },
    {
    	type: 'email',
      key: 'email',
      label: 'Email'
    },
    {
    	type: 'button',
      key: 'submit',
      label: 'Submit'
    }
  ]
});
````

✅ Pros
- Huge list of features

🛑 Cons
- Too much unused features
- Not open source
- No self hosting

### Option 3: React JSONSchema Form (RJSF)

Documentation:
https://rjsf-team.github.io/react-jsonschema-form/docs/

Rpository:
https://github.com/rjsf-team/react-jsonschema-form

Description:
A simple React component capable of using JSON Schema to declaratively build and customize web forms.

Implementation example:
```js
import Form from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';

const schema: RJSFSchema = {
  title: 'Todo',
  type: 'object',
  required: ['title'],
  properties: {
    title: { type: 'string', title: 'Title', default: 'A new task' },
    done: { type: 'boolean', title: 'Done?', default: false },
  },
};

const log = (type) => console.log.bind(console, type);

render(
  <Form
    schema={schema}
    validator={validator}
    onChange={log('changed')}
    onSubmit={log('submitted')}
    onError={log('errors')}
  />,
  document.getElementById('app')
);
````

✅ Pros:
- Support multiple [themes](https://rjsf-team.github.io/react-jsonschema-form/docs/usage/themes) like [shadcn](https://github.com/rjsf-team/react-jsonschema-form/tree/main/packages/shadcn), ant design, etc.
- Native suuport of JSON to form logic
- Suport typescript

🛑 Cons:
-


### Option 4: Uniforms

Documentation:
https://uniforms.tools/

Rpository:
https://github.com/vazco/uniforms

Description:
A React library for building forms from any schema
- support of all schemas and themes
- instant prototyping
- simplifies separation of concerns

✅ Pros:
- Multiple schema types supported: SON Schema, GraphQL, SimpleSchema, SimpleSchema2, Zod.
-

🛑 Cons:
- Yaml schema not natively supported
- Support only reduced selection of themes (AntDesign, bootstrap, Material, etc.)

### Option 5: Formily

Documentation:
https://formilyjs.org/guide

Rpository:
https://github.com/alibaba/formily

Description:
Alibaba Unified Front-end Form Solution

✅ Pros:
-

🛑 Cons:
- Owned by Alibaba

### Option 6: Custom internal renderer

Documentation:
https://react-hook-form.com/

Rpository:
https://github.com/react-hook-form/react-hook-form

Description:
Custom schema rendered via a battle wornm form react library.

✅ Pros:
- Highly customizable

🛑 Cons:
- High implementation effort
- High maintenance effort

---

## Evaluation Against Criteria

| Criteria | SurveyJS | Form.io | RJSF | Uniforms | Formly | RHF |
| --- | --- | --- | --- | --- | --- | --- |
| Open source | Yes | No | Yes | Yes | Yes | Yes |
| Cloud dependency | No | Yes | No | No | No | No |
| Self hostable | Yes | No | – | – | – | – | – |
| Simplicity | Ok | Meh | Ok | Ok | Ok | Meh |
| Customisation | Meh | Meh | Yes | Ok | Ok | High |
| Own components | No | No | Yes | Yes | Yes | Yes |
| Implementation effort | Ok | Ok | Ok | Ok | Ok | High |
| Maintenance effort | Ok | Ok | Ok | Ok | Ok | High |
| Vendor Lock-In Risk | Very high | Very high | Low | Low | High | Very low |

---

## Decision
Let's go with React Hook Form. The outlines of the project are still unclear, it will leave us the biggest liberty and make sure we don't need to roll back at some point.

---

## Comequences

### Positive
- We do what we want
- Big learning potential

### Negative
- High implementation effort
- We are kind of reinventing the wheel

### Tradeoffs

---

## Implementation plan

---

## Validation

---

## Open questions
