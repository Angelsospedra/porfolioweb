# Componentes

## Layout

### `Header`
Navbar sticky con detección de scroll. Contiene:
- Logo (scroll to top)
- Links de navegación
- Controles: AchievementsDropdown, LangSwitcher, AccentPicker, ThemeToggle
- En móvil: hamburger → menú fullscreen en portal

Cuando se desbloquean los 5 logros, el logo y el navbar ganan un "Legendary Glow" con el color amarillo.

### `Footer`
Pie de página simple con links sociales y créditos.

---

## Secciones

### `Hero`
Layout en grid 2 columnas (desktop): foto a la izquierda, nombre + bio a la derecha.
- Animaciones fade-up secuenciales con Framer Motion
- CTAs: "Ver trabajo" / "Contáctame" / "Descargar CV"
- Links sociales: GitHub, LinkedIn, ArtStation

### `About`
Presentación personal con dos bloques:
- **Texto con efecto Explosion**: los caracteres del texto se pueden derribar arrastrando un skill icon encima. Cuando todas las letras han "explotado" se desbloquea el logro `letters`.
- **Hint**: mensaje "Coge un icono y pásalo por el texto" (`about.skill_hint`) con animación `blink` y ghost hint animado la primera vez que la sección es visible.
- **Skills grid**: iconos de tecnologías agrupados por categoría (Frontend / Tools), arrastrables para activar el efecto.

### `Projects`
Grid de tarjetas de proyectos con drag & drop (@dnd-kit):
- Toggle lock/unlock para habilitar reordenado
- Hover → preview en vídeo (carga lazy, play después de 1s)
- Clic → `MediaViewer` con galería completa del proyecto
- Desbloquear el logro `reorder` al reordenar por primera vez

### `Journey`
Timeline horizontal (desktop) / vertical (móvil) con dos grupos: educación y experiencia laboral.
- Logos de empresas/centros en cada tarjeta
- Animación de entrada al entrar en viewport (`useInView`)
- **Notas musicales de piano** (solo desktop): cada tarjeta tiene asignada una nota (Do→Ceremón, Re→TSMR, Mi→Polygonal, Fa→3D, Sol→StartGo, La→Máster, Si→Conmuta, Do→DAW). Al mantener pulsada una tarjeta suena la nota y aparece el nombre sobre el círculo del timeline; al soltar se aplica un release natural de ~1s.
- Audio por samples MP3 reales (`public/piano/C4.mp3` … `C5.mp3`), cargados con Web Audio API y cacheados en un `AudioContext` compartido. Sin síntesis por osciladores.
- Pulsar cualquier tarjeta desbloquea el logro `melody`.

### `Art3D`
Galería de obras 3D:
- Modelos `.glb` interactivos con OrbitControls (react-three-fiber)
- Fallback a galería de imágenes para obras sin modelo 3D
- `MediaViewer` especializado que soporta modelo 3D + media gallery

### `Contact`
Formulario de contacto + links directos:
- Integración EmailJS (sin backend)
- Estados: `idle → sending → sent | error`
- Validación básica en cliente

---

## UI reutilizable

| Componente | Propósito |
|-----------|-----------|
| `Button` | Botón genérico con variantes: `default`, `outline`, `ghost` |
| `Tag` | Badge/etiqueta para tecnologías y categorías |
| `ThemeToggle` | Alterna dark/light |
| `LangSwitcher` | Dropdown idiomas (ES / EN / VA) con fade de transición |
| `AccentPicker` | Selector de color de acento (5 opciones + 1 legendary) |
| `AchievementsDropdown` | Lista de logros con estado desbloqueado/bloqueado |
| `AchievementToast` | Notificación emergente al desbloquear un logro |
| `WelcomeModal` | Modal de bienvenida en primera visita |
| `MediaViewer` | Visor fullscreen para imágenes, vídeos y modelos 3D |

---

## Hooks

### `useInView(threshold?)`
Envuelve `IntersectionObserver`. Devuelve `[ref, isInView]`. Se desconecta tras el primer trigger para no re-animar.

---

## Sistema de logros

Definidos en `AchievementsContext`. Cinco logros:

| ID | Cuándo se desbloquea | Icono |
|----|----------------------|-------|
| `letters` | Al arrastrar un skill icon sobre todo el texto del About hasta romper todas las letras | FaExplosion |
| `reorder` | Al reordenar proyectos con drag & drop | LuLayoutGrid |
| `mail` | Al enviar el formulario de contacto | TbMail |
| `cv` | Al descargar el CV | TbFileText |
| `melody` | Al pulsar cualquier tarjeta de la sección Journey (desktop) | TbPiano |

Al completar los cinco, se desbloquea automáticamente el color de acento `yellow` (Legendary).
