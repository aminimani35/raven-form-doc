# Commencer

Bienvenue sur RavenForm ! Ce guide vous aidera à démarrer avec le moteur de formulaires complet.

## Installation

Installez RavenForm en utilisant npm :

```bash
npm install raven-form
```

Ou avec yarn :

```bash
yarn add raven-form
```

## Utilisation de Base

Voici un exemple simple pour créer votre premier formulaire :

```tsx
import { RavenForm } from 'raven-form';

function MonFormulaire() {
  return (
    <RavenForm
      schema={{
        fields: [
          {
            name: 'email',
            type: 'email',
            label: 'Adresse E-mail',
            required: true
          },
          {
            name: 'password',
            type: 'password',
            label: 'Mot de Passe',
            required: true
          }
        ]
      }}
      onSubmit={(values) => {
        console.log('Formulaire soumis:', values);
      }}
    />
  );
}
```

## Configuration du Formulaire

RavenForm utilise une approche basée sur un schéma pour définir vos formulaires. L'objet schéma comprend :

- **fields** : Un tableau de définitions de champs
- **validation** : Règles de validation personnalisées
- **layout** : Configuration de la mise en page du formulaire

### Types de Champ

RavenForm prend en charge différents types de champs :

- `text` - Entrée de texte basique
- `email` - Entrée d'e-mail avec validation
- `password` - Entrée de mot de passe
- `number` - Entrée numérique
- `select` - Sélection déroulante
- `checkbox` - Case à cocher unique
- `radio` - Groupe de boutons radio
- `textarea` - Entrée de texte multiligne
- `date` - Sélecteur de date

## Prochaines Étapes

::: tip
Consultez les [Exemples API](/fr/api-examples) pour voir des modèles d'utilisation plus avancés.
:::

- Découvrez la [validation de formulaire](#)
- Explorez les [types de champs personnalisés](#)
- Configurez les [mises en page de formulaire](#)
- Gérez les [soumissions asynchrones](#)
