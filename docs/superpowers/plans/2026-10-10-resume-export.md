# Resume pages and PDF export implementation plan

**Goal:** Header dropdown with React, React Native and Fullstack resumes, polished A4 previews, direct PDF download and browser printing.

**Architecture:** Canonical validated JSON feeds one shared resume presentation model. Thin locale pages consume feature components. A Node route generates an attachment using the same model and local Montserrat fonts; PDF rendering stays off the client bundle.

**Design:** White A4 document, navy headings and blue rules, full-width contact header, generous readable single-column sections, restrained typography. Empty data sections are omitted; incomplete Fullstack data is explained outside the printed document. Controls follow the current language; resume content remains English.

**Constraints:** No invented records, database or admin panel. JSON changes update preview and PDF after rebuild/deploy. Preserve current fonts, locale routes, theme and accessibility. No commit/push in this task.

- [x] Add shared profile catalog and immutable presentation model, with test-first coverage for profile isolation, JSON updates, dates and optional/empty sections.
- [x] Implement accessible header dropdown with Escape, outside-click closing and localized links.
- [x] Add six static locale/profile preview pages and unknown-profile 404; add download/print controls and print stylesheet.
- [x] Generate selectable-text A4 PDF attachments with embedded local fonts, pagination and working links. Add Node route validation and file tracing for deployment.
- [x] Verify tests, typecheck, lint, build, dropdown keyboard/mobile behavior, all profiles, downloads, PDF page render and print layout. Update architecture/docs.

**Review focus:** Unknown profiles never leak through; latest JSON content appears in both outputs; empty Fullstack remains honest; long entries paginate without clipping; dropdown and controls work with keyboard and narrow screens.


## Verification results

- 107 tests across six files pass; typecheck, lint and production build pass.
- All six locale/profile previews return successfully; all three API downloads return valid PDF attachments. Invalid API profiles return strict 404 responses.
- Final PDF renders inspected: React two A4 pages, React Native three, Fullstack one. Canonical work highlights and projects remain present; embedded font glyphs, page bounds and page numbers verified on every page.
- Header menus at 320px in both languages fit the viewport while open and closed; 601px Persian and 640px English headers also fit. Outside click and Escape close the menu; Escape restores summary focus.
- Invalid preview shows the not-found UI and noindex. Next.js may return HTTP 200 once a streamed preview response has started; this framework behavior is documented in architecture.md.
- Print button invokes the browser print dialog after fonts load; print CSS hides controls and applies A4 paper styling. Native print-preview rendering was not visually inspected; the independently generated downloadable PDFs were rendered and inspected.
- Final screenshot saved to the chat outputs directory. README, architecture and design-system documentation updated. Changes remain uncommitted; no push or deployment performed.

- Independent review identified potential footer overlap with future JSON additions. Bottom padding increased to 64pt; production rebuilt and all PDF artifacts regenerated/re-rendered. Final content and footer bounds remain separated. No other actionable review findings.

## Deployment follow-up — 2026-10-10

The user requested deployment after implementation. Fresh checks: 107 tests pass; lint and production build (including TypeScript) pass. Changes are being committed individually and pushed to the existing main branch for the connected Vercel project. The supplied Avenir files were not applied because neither contains Persian glyphs.
