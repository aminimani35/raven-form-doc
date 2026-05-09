# Comenzar

¡Bienvenido a RavenForm! Esta guía te ayudará a empezar con el motor de formularios completo.

## Instalación

Instala RavenForm usando npm:

```bash
npm install raven-form
```

O con yarn:

```bash
yarn add raven-form
```

## Uso Básico

Aquí hay un ejemplo simple para crear tu primer formulario:

```tsx
import { RavenForm } from 'raven-form';

function MiFormulario() {
  return (
    <RavenForm
      schema={{
        fields: [
          {
            name: 'email',
            type: 'email',
            label: 'Correo Electrónico',
            required: true
          },
          {
            name: 'password',
            type: 'password',
            label: 'Contraseña',
            required: true
          }
        ]
      }}
      onSubmit={(values) => {
        console.log('Formulario enviado:', values);
      }}
    />
  );
}
```

## Configuración del Formulario

RavenForm utiliza un enfoque basado en esquemas para definir tus formularios. El objeto de esquema incluye:

- **fields**: Un arreglo de definiciones de campos
- **validation**: Reglas de validación personalizadas
- **layout**: Configuración de diseño del formulario

### Tipos de Campo

RavenForm admite varios tipos de campo:

- `text` - Entrada de texto básica
- `email` - Entrada de correo electrónico con validación
- `password` - Entrada de contraseña
- `number` - Entrada numérica
- `select` - Selección desplegable
- `checkbox` - Casilla de verificación única
- `radio` - Grupo de botones de radio
- `textarea` - Entrada de texto multilínea
- `date` - Selector de fecha

## Próximos Pasos

::: tip
Consulta los [Ejemplos de API](/es/api-examples) para ver patrones de uso más avanzados.
:::

- Aprende sobre [validación de formularios](#)
- Explora [tipos de campo personalizados](#)
- Configura [diseños de formulario](#)
- Maneja [envíos asíncronos](#)
