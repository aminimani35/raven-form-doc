# Getting Started

Welcome to RavenForm! This guide will help you get up and running with the full-featured form engine.

## Installation

Install RavenForm using npm:

```bash
npm install raven-form
```

Or with yarn:

```bash
yarn add raven-form
```

## Basic Usage

Here's a simple example to create your first form:

{% raw %}
```tsx
import { RavenForm } from 'raven-form';

function MyForm() {
  return (
    <RavenForm
      schema={{
        fields: [
          {
            name: 'email',
            type: 'email',
            label: 'Email Address',
            required: true
          },
          {
            name: 'password',
            type: 'password',
            label: 'Password',
            required: true
          }
        ]
      }}
      onSubmit={(values) => {
        console.log('Form submitted:', values);
      }}
    />
  );
}
```
{% endraw %}

## Form Configuration

RavenForm uses a schema-based approach to define your forms. The schema object includes:

- **fields**: An array of field definitions
- **validation**: Custom validation rules
- **layout**: Form layout configuration

### Field Types

RavenForm supports various field types:

- `text` - Basic text input
- `email` - Email input with validation
- `password` - Password input
- `number` - Numeric input
- `select` - Dropdown selection
- `checkbox` - Single checkbox
- `radio` - Radio button group
- `textarea` - Multi-line text input
- `date` - Date picker

## Next Steps

::: tip
Check out the [API Examples](/api-examples) to see more advanced usage patterns.
:::

- Learn about [form validation](#)
- Explore [custom field types](#)
- Configure [form layouts](#)
- Handle [async submissions](#)
