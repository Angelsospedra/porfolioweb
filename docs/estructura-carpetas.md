# Estructura de Carpetas

```
porfolioweb/
├── public/                    # Assets estáticos (servidos tal cual)
│   ├── angel.png              # Foto de perfil
│   ├── CV.pdf                 # CV descargable
│   ├── favicon.png
│   ├── icons.svg
│   ├── images/                # Renders de proyectos 3D
│   │   ├── AK/                #   Rifle AK (6 imágenes)
│   │   ├── Sword/             #   Espada WoW (3 imágenes)
│   │   ├── Terror Environment/#   Escena terror (3 imágenes)
│   │   └── Vinilocos/
│   ├── logos/                 # Logos empresas (7 PNGs)
│   ├── models/                # Modelos 3D
│   │   ├── canon.glb
│   │   └── lamp.glb
│   ├── thumbs/
│   │   ├── 3d/                # Miniaturas proyectos 3D
│   │   └── proyectos/         # Miniaturas proyectos web
│   └── videos/                # Demos en vídeo (MP4)
│
├── src/
│   ├── assets/                # Imágenes importadas en código
│   ├── components/
│   │   ├── layout/            # Header + Footer
│   │   ├── sections/          # Una carpeta → una sección de página
│   │   └── ui/                # Componentes reutilizables
│   │       └── icons/         # SVGs custom (GitHub, LinkedIn…)
│   ├── context/               # ThemeContext, AccentContext, AchievementsContext
│   ├── data/                  # Arrays de datos estáticos (projects, skills, art3d)
│   ├── hooks/                 # useInView (IntersectionObserver)
│   ├── i18n/
│   │   ├── config.ts
│   │   └── locales/           # en.json · es.json · va.json
│   ├── styles/
│   │   ├── global.css         # Reset, scrollbar, scroll-snap
│   │   └── variables.css      # CSS Custom Properties (temas + acentos)
│   ├── types/                 # Interfaces TypeScript (index.ts)
│   ├── App.tsx
│   └── main.tsx
│
├── docs/                      # Esta documentación
├── .github/workflows/         # CI/CD (deploy Vercel)
├── .env.example               # Template variables EmailJS
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
└── vercel.json
```

## Convenciones de nomenclatura

- Componentes: `PascalCase.tsx` + `PascalCase.module.css` en la misma carpeta
- Secciones: un archivo por sección, sin subcarpetas dentro de `sections/`
- Datos estáticos: archivos `.ts` planos en `data/`, sin lógica
- Hooks: prefijo `use` en camelCase
- Contextos: sufijo `Context` en el nombre del archivo y del objeto

## Cada sección es autónoma

Cada archivo en `sections/` contiene su propio CSS Module. No hay estilos compartidos entre secciones — cualquier token visual compartido va en `variables.css`.
