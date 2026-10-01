# RC 1

![Status Todo](https://img.shields.io/badge/Status-Todo-blue.svg)

The first release candidate should allow a contributor to configure a form to ask its client for input and access this input.

## Specifications

### Form configuration

The MVP of configuration is via a file in code. We will avoid setting up a management system for now. Setting a new form should be as simple to configure a new route and associate a config file. There is only one instance of the form and anyone getting access to the page is able to edit it.
Collaborators access the data fron the client by directly accessing the form page.

Configuration file example:

```yaml
form: # unique form id
  email: me@example.com
  name: My client
  id: my-client
  descrition: >
    Lorem ipsum
  steps:
    title: First step
    fields:
      name:
        label: Name
        name: name
        type: text
        required: true
      actions:
```

- The form can have multiple steps
- A step can have multiple fields
- A field can have:
  - A title
  - A description
  - An input
- An input can be:
  - A short input
  - A text field
  - A select of multiple options
  - A group of mutliple checkobxes
  - A radio group
- A step can have non input elements
  - A title
  - blocs of rich text
  - Actions to
    - Move to next step
    - Come back to previous state
    - Validate the form
  - Actions label have default values according to the step position
    - By default the first step has a next action with the label 'Start'
    - By default the last step has a next action with the label 'Finish'
    - By default the previous action has a label 'back'
    - By default the next action has a label 'next'
  - Actions label can be customised
  - A form can be localised

#### Routing
`/form/my-client` redirect to the form defined by the configuration with the `my-client` id.


#### THe client can use a form
- The client can access the form online
- The client input is saved as it is added

#### The contributor can acces the form input
- The form data is persistent in the browser session

#### On validation
- An email is sent to the admin
- The data is saved as a JSON file on the server
