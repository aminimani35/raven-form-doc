# Ejemplos de API en Tiempo de Ejecución

Esta página demuestra el uso de algunos de los API en tiempo de ejecución proporcionados por VitePress.

La API principal que usarás es `useData()`, que te da acceso a los datos en tiempo de ejecución de la página actual.

```js
import { useData } from 'vitepress'

const { theme, page, frontmatter } = useData()
```
