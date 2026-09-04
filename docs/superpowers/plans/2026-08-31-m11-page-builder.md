# M11 Page Builder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Build a structured Framer/Webflow-inspired Academy page builder connected to M10 commerce without arbitrary code execution.

**Architecture:** Persist pages and ordered typed sections. Render published pages through a server-authorized resolver that hydrates course, curriculum, instructor and offer data from current Academy records. Creator Studio edits structure/settings; Academy AI can only propose a validated block document that is reviewed before Apply.

**Tech Stack:** Laravel 13, React 19, Inertia 3, Tailwind 4, PostgreSQL/pgvector, Redis, existing Academy AI provider abstraction.

**Spec:** M11 roadmap agreed in conversation: Hero, Features, Instructor, Course, Curriculum, Testimonials, Pricing, FAQ, CTA, Footer; variants, drag/drop, AI structured editing, live M10 offer binding, Coolify-compatible cumulative release.

## Global Constraints

- Keep Laravel + React + Inertia; no Webflow/Framer runtime dependency.
- No arbitrary HTML/JS/CSS code blocks.
- Course/pricing data must come from current Academy records, never copied ledger truth.
- Trainer ownership enforced server-side on every mutation.
- Published page must use only an allow-listed block type/variant/settings schema.
- Keep current Coolify topology unchanged.

---

### Task 1: Page domain and ownership
- [ ] Add `AcademyPage` and `AcademyPageSection` migrations/models.
- [ ] Add trainer relationship and unique trainer+slug constraint.
- [ ] Add contract and Laravel feature coverage.

### Task 2: Structured renderer
- [ ] Add allow-listed block registry and section resolver.
- [ ] Bind Course/Curriculum/Instructor/Pricing blocks to live course and M10 offer data.
- [ ] Add public route/controller for published pages only.

### Task 3: Creator Studio builder
- [ ] Add page list/create/editor routes and controller.
- [ ] Add section create/update/delete/reorder endpoints.
- [ ] Build 3-pane editor with native drag reorder and inspector.
- [ ] Add publish/unpublish and preview.

### Task 4: Academy AI page capabilities
- [ ] Add `page.generate` and `page.optimize` structured JSON capabilities.
- [ ] Apply only after explicit review; materialize validated draft/section document.
- [ ] Never accept arbitrary HTML/JS/CSS from model output.

### Task 5: Public page experience and commerce binding
- [ ] Render all ten block families through reusable React components.
- [ ] Pricing CTA uses live `CourseOffer` IDs and normal checkout path.
- [ ] Theme Engine tokens remain the visual source of truth.

### Task 6: Release gate
- [ ] Update README/docs/version to 0.11.0.
- [ ] Run M07-M11 contracts, PHP syntax, Prettier, ESLint, classified TypeScript, Coolify structure and hygiene scans.
- [ ] Package v0.11.0, SHA-256, fresh extract and rerun release gate.
