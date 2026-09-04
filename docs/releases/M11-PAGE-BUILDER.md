# M11 — Structured Page Builder

M11 introduces a safe Framer/Webflow-inspired page composer without adding a second website runtime.

## Scope

- Persistent `AcademyPage` + ordered `AcademyPageSection` domain.
- Ten allow-listed block families: Hero, Features, Instructor, Course, Curriculum, Testimonials, Pricing, FAQ, CTA and Footer.
- Multiple visual variants per block using the existing Theme Engine.
- Three-pane Creator Studio editor: block library, canvas/preview and inspector.
- Native drag reorder; no new drag-and-drop package.
- Draft preview plus explicit publish/unpublish lifecycle.
- Public pages at `/p/{slug}` only when published.
- Live Course/Curriculum/Instructor hydration from Academy records.
- Live Pricing hydration from active M10 `CourseOffer` records; prices are not copied into page JSON.
- `page.generate` and `page.optimize` Academy AI capabilities using structured JSON only.
- Proposal → Review → Apply semantics; AI-created pages remain drafts.
- No arbitrary HTML, JavaScript or CSS blocks.
- URL allow-list for CTA/footer links (`/`, `#`, `http`, `https`, `mailto`).
- Existing Coolify topology remains unchanged.

## Runtime model

```text
Creator Studio
   ↓
Page Builder
   ↓
AcademyPage
   ↓
AcademyPageSection[]
   ↓
PageBlockRegistry allow-list
   ↓
PageSectionResolver
   ├── Course
   ├── Curriculum
   ├── Trainer
   └── M10 CourseOffer
   ↓
React PageRenderer
   ↓
/p/{slug}
```

## AI model

```text
Academy AI
   ├── page.generate
   └── page.optimize
          ↓
Structured JSON schema
          ↓
Review
          ↓
Apply
          ↓
Draft page / draft optimization
```

No model output is treated as executable code.
