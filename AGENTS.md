<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Portfolio design system

- Keep shared visual values in `src/styles/theme.css`; use semantic color tokens instead of raw colors in components.
- Keep shared component styles in `src/styles/components.css` and reusable React primitives in `src/components/ui/`.
- Reuse `Button` for actions. Navigation stays a semantic link, using the shared `ui-button` styles when it looks like a button.
- Use the shared typography, spacing, radius, and motion tokens. Add tokens only for repeated design decisions; avoid creating unused components.
- Support light/dark themes, Persian/English fonts, logical direction utilities, keyboard focus, and reduced motion in new UI.
- See `docs/design-system.md` for current values, examples, and the boundaries of this foundation.

## Architecture

- Keep route files in `src/app/[locale]/` thin. Portfolio-specific sections and presentation logic belong in `src/features/portfolio/`.
- Resume JSON is canonical professional data. Consume the validated loader in `src/lib/resume/`; do not duplicate resume records in components, translations, or stores.
- Interface translations belong in `src/messages/`. English resume content must retain `lang="en"` and `dir="ltr"` on the Persian page.
- Prefer Server Components. Use client boundaries only for real interactions; create Zustand stores per component/provider instance to prevent shared server state.
- Sort a copy of merged work in the presentation layer; preserve loader deduplication precedence and canonical source order.
- Enumerate supported project link kinds; optional links and images must not produce dead controls.
- Read `docs/architecture.md` before adding a new feature. PDF export is a separate future feature consuming the same validated resumes.
