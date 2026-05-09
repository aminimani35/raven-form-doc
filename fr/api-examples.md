# Exemples d'API d'Exécution

Cette page démontre l'utilisation de certaines API d'exécution fournies par VitePress.

L'API principale que vous utiliserez est `useData()`, qui vous donne accès aux données d'exécution de la page actuelle.

```js
import { useData } from 'vitepress'

const { theme, page, frontmatter } = useData()
```
