# RC 1

![Status Todo](https://img.shields.io/badge/Status-Todo-blue.svg)

The first release candidate should allow a contributor to configure a form to ask its client for input and access this input.

## Specifications

### Form configuration

The MVP of configuration is via a file in code. We will avoid setting up a management system for now. Setting a new form should be as simple to configure a new route and associate a config file. There is only one instance of the form and anyone getting access to the page is able to edit it.
Collaborators access the data fron the client by directly accessing the form page.

COnfiguration file example:

```yaml
form: # unique form id
  name: My client
  id: my-client
  descrition: >
    Lorem ipsum
  fields:
    name:
      label: Name
      name: name
      type: text
      required: true
```

- The form can have multiple fields
- A field can have:
  - A title
  - A description
  - An input
- An input can be:
  - A short input
  - A text field
  - A select of multiple options
  - A group of mutliple checkobxes

#### Routing
`/form/my-client` redirect to the form defined by the configuration with the `my-client` id.


#### THe client can use a form
- The client can access the form online
- The client input is saved as it is added

#### The contributor can acces the form input
- The form data is persistent accross browsers
