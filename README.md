# Showcase

Work and pitch showcase site. Dark, motion-led single page with detail routes
for each project and pitch.

## Stack

Vite · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · React Router 7

## Develop

```bash
npm install
npm run dev
```

## Editing content

All copy lives in typed content files — no component changes needed:

- `src/content/projects.ts` — shipped work
- `src/content/pitches.ts` — SaaS product ideas
- `src/content/types.ts` — the shape of both

Covers are optional; without one, a card renders a generated gradient.

## Design system

Tokens (colour, type, easing) are defined once in the `@theme` block of
`src/index.css`, alongside the `.glass`, `.panel` and `.gradient-text`
utilities. Retheming the whole site is an edit to that file.

## Build

```bash
npm run build && npm run preview
```
