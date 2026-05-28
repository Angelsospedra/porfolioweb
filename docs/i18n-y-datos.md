# i18n y Datos Estáticos

## Internacionalización

### Idiomas soportados

| Código | Idioma | Archivo |
|--------|--------|---------|
| `es` | Español | `src/i18n/locales/es.json` |
| `en` | Inglés | `src/i18n/locales/en.json` |
| `va` | Valenciano | `src/i18n/locales/va.json` |

### Configuración (`src/i18n/config.ts`)

- `i18next` inicializado con `initReactI18next`
- Idioma por defecto: `es`
- Persistencia: `localStorage['lang']`
- Detección automática del idioma del navegador

### Uso en componentes

```tsx
const { t } = useTranslation()
// ...
<h1>{t('hero.greeting')}</h1>
```

### Cambio de idioma (LangSwitcher)

El switcher aplica un fade-out sobre el `<main>` antes de cambiar el idioma y un fade-in después, evitando el salto visual del texto.

### Estructura de los JSON

```json
{
  "nav": { "about": "Sobre mí", "projects": "Proyectos", ... },
  "hero": { "greeting": "Hola, soy", "role": "...", "bio": "...", ... },
  "about": { ... },
  "projects": { ... },
  "journey": { ... },
  "art3d": { ... },
  "contact": { ... }
}
```

---

## Datos estáticos

Los datos que no cambian están en `src/data/` como arrays TypeScript tipados. No hay llamadas a API.

### `projects.ts`

Array de objetos `Project`. Cada proyecto tiene:

```typescript
interface Project {
  id: number
  title: string
  description: string        // clave i18n o texto directo
  tags: string[]
  githubUrl?: string
  liveUrl?: string
  featured?: boolean
  thumb?: string             // ruta desde public/
  media?: ProjectMedia[]     // galería de imágenes/vídeos
}

interface ProjectMedia {
  type: 'image' | 'video'
  src: string
  poster?: string
  objectPosition?: string
}
```

### `skills.ts`

Array de objetos `Skill` con nombre e icono (componente React Icon):

```typescript
interface Skill {
  name: string
  category: 'frontend' | 'tools'
}
```

Actualmente 23 skills: React, Angular, Next.js, TypeScript, Tailwind, Three.js, Git, Figma, etc.

### `art3d.ts`

Array de obras 3D:

```typescript
interface Art3DItem {
  id: string
  title: string
  description: string
  thumb: string              // miniatura (public/thumbs/3d/)
  model: string              // ruta .glb (public/models/) o ''
  images?: string[]          // galería de renders (public/images/)
  video?: string             // vídeo demo (public/videos/)
  link: string               // URL ArtStation
  year: number
}
```

5 obras: Canon (GLB), Lamp (GLB), AK47, Terror Environment, WoW Sword.
