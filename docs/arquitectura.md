# Arquitectura del Proyecto

## Stack tecnológico

| Categoría | Tecnología |
|-----------|-----------|
| Framework | React 19 + TypeScript 6 |
| Build tool | Vite 8 |
| Estilos | CSS Modules + CSS Custom Properties |
| Animaciones | Framer Motion |
| 3D | Three.js + react-three-fiber + drei |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| i18n | i18next + react-i18next |
| Email | @emailjs/browser |
| Deploy | Vercel (`base: '/porfolioweb/'`) |

## Patrón general

Single Page App sin router. La navegación usa anchors (`#section`). No hay framework CSS — toda la maquetación es CSS Modules con variables globales.

```
index.html
└── main.tsx          ← monta React + i18n + providers
    └── App.tsx       ← wrappea providers de contexto + secciones
        ├── Header    ← layout
        ├── Hero
        ├── About
        ├── Projects
        ├── Journey
        ├── Art3D
        ├── Contact
        └── Footer    ← layout
```

## Estado global

Tres contextos React, todos persistidos en `localStorage`:

| Contexto | Valor | Key localStorage |
|----------|-------|-----------------|
| `ThemeContext` | `'dark' \| 'light'` | `theme` |
| `AccentContext` | `'green' \| 'red' \| 'blue' \| 'purple' \| 'yellow'` | `accent` |
| `AchievementsContext` | `Set<AchievementId>` | `portfolio_achievements` |

El color `yellow` es "Legendary" — solo se desbloquea al completar los 4 logros.

## Estilos y temas

Las variables CSS globales viven en `src/styles/variables.css`. El tema se aplica mediante el atributo `data-theme` en `<html>`, y el color de acento mediante `data-accent`:

```css
/* Cambio de tema */
html[data-theme="dark"]  { --bg-primary: #0d0d0d; ... }
html[data-theme="light"] { --bg-primary: #fafafa; ... }

/* Cambio de acento */
html[data-accent="green"]  { --accent: #6ee7b7; ... }
html[data-accent="red"]    { --accent: #f87171; ... }
```

La transición entre colores es suave gracias a `transition: 0.4s ease` en las propiedades de acento.

## Build y deploy

```bash
npm run dev       # desarrollo local (Vite HMR)
npm run build     # tsc --noEmit && vite build → dist/
npm run preview   # preview del build
npm run lint      # ESLint flat config
```

El deploy en Vercel usa el rewrite de `vercel.json` para servir siempre `index.html` (SPA routing).
