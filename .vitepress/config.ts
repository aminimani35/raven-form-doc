import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Full-Featured Form-Engine",
  description: "RavenForm",

  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Examples', link: '/markdown-examples' }
        ],
        sidebar: [
          {
            text: 'Guide',
            items: [
              { text: 'Getting Started', link: '/getting-started' }
            ]
          },
          {
            text: 'Examples',
            items: [
              { text: 'Markdown Examples', link: '/markdown-examples' },
              { text: 'Runtime API Examples', link: '/api-examples' }
            ]
          }
        ]
      }
    },
    es: {
      label: 'Español',
      lang: 'es',
      link: '/es/',
      themeConfig: {
        nav: [
          { text: 'Inicio', link: '/es/' },
          { text: 'Comenzar', link: '/es/getting-started' },
          { text: 'Ejemplos', link: '/es/markdown-examples' }
        ],
        sidebar: [
          {
            text: 'Guía',
            items: [
              { text: 'Comenzar', link: '/es/getting-started' }
            ]
          },
          {
            text: 'Ejemplos',
            items: [
              { text: 'Ejemplos de Markdown', link: '/es/markdown-examples' },
              { text: 'Ejemplos de API', link: '/es/api-examples' }
            ]
          }
        ]
      }
    },
    fr: {
      label: 'Français',
      lang: 'fr',
      link: '/fr/',
      themeConfig: {
        nav: [
          { text: 'Accueil', link: '/fr/' },
          { text: 'Commencer', link: '/fr/getting-started' },
          { text: 'Exemples', link: '/fr/markdown-examples' }
        ],
        sidebar: [
          {
            text: 'Guide',
            items: [
              { text: 'Commencer', link: '/fr/getting-started' }
            ]
          },
          {
            text: 'Exemples',
            items: [
              { text: 'Exemples Markdown', link: '/fr/markdown-examples' },
              { text: 'Exemples API', link: '/fr/api-examples' }
            ]
          }
        ]
      }
    }
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
