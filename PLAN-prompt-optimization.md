# Prompt Optimization Plan

## Problem

Each MCP tool call sends ~9,300 tokens of system prompts. ~30% is generic knowledge Claude already has. The overhead makes MCP output slower and more expensive than just asking Claude directly, with no visible quality improvement.

## Goal

Cut prompt tokens by ~60% (9,300 → ~3,500) while improving output quality by giving Claude more creative freedom.

---

## Phase 1: Compress Prompts

### 1.1 — Gut `mjml-guide.ts` (4,200 → ~800 tokens)

**Remove:** All basic MJML syntax (mj-section, mj-column, mj-text, mj-button, mj-image). Claude knows this.

**Keep only production gotchas Claude doesn't know:**
- Outlook background-color fallback when using css-class gradients
- @keyframes must be in mj-style (not inline), and degrade gracefully in Gmail/Outlook
- mj-wrapper for full-width colored sections vs mj-section for content
- mj-attributes for DRY defaults
- css-class for anything inline styles can't do (gradients, animations, pseudo-elements)
- Dark mode: prefers-color-scheme media query + [data-ogsc] Outlook override

### 1.2 — Merge design rules into one file (~2,200 → ~400 tokens)

**Replace 6 files** (color-usage, typography, spacing, layout-principles, cta-patterns, advanced-effects) with a single `design-rules.ts` containing a concise constraint list:

```
- Headlines: 44-56px, weight 800-900, line-height 1.05
- Body: 15-16px, weight 300, line-height 1.7
- Subheadings: 11-13px uppercase, letter-spacing 0.15em
- Hero: min 400px height, cinematic, full-width imagery
- Spacing: 56-64px hero padding, 40-48px sections, generous = premium
- Rhythm: dark hero → light body → cards → dark CTA → dark footer. Never 2 white sections in a row
- CTAs: 50px border-radius, 40-48px horizontal padding, accent color. Ghost secondary variant
- Gradients: use as dividers, backgrounds, overlays — not just flat colors
- Depth: layered shadows (2px, 4px, 16px), subtle transforms for dimension
- Animations: fadeInUp, pulse, gradientShift — always degrade to static gracefully
- 600px max-width, mobile-first stacking
```

### 1.3 — Trim `email-expert.ts` (1,300 → ~300 tokens)

**Replace** the philosophy essay with 3 guiding principles:

```
You design emails at ReallyGoodEmails.com portfolio level.
- Emails are experiences, not documents. Use motion, depth, and visual drama.
- Every section should have a distinct visual identity (color, texture, or imagery).
- Restraint in copy, generosity in whitespace. Let the design breathe.
```

### 1.4 — Keep as-is

- **Brand context** (~130 tokens) — 100% unique, already concise
- **Image library** (~900 tokens) — 100% unique, provides real URLs
- **Layout variants** (~500 tokens) — 85-95% unique, specific sequencing

---

## Phase 2: Refactor Prompt Assembly

### 2.1 — Simplify `src/prompts/design-rules/`

- Delete individual files: `color-usage.ts`, `typography.ts`, `spacing.ts`, `layout-principles.ts`, `cta-patterns.ts`, `advanced-effects.ts`
- Replace with single `design-rules.ts` exporting one const
- Update `index.ts` to export from the single file

### 2.2 — Update tool handlers

- `generate-email.ts`: assembles the leaner prompt stack
- `screenshot-to-email.ts`: already has its own specialized prompt — trim its MJML reference section similarly

### 2.3 — Update tests

- Snapshot tests will need updating for new prompt text
- Functional behavior should remain the same

---

## Phase 3: Screenshot-to-Email Focus

### 3.1 — Tighten reproduction prompt

The screenshot tool should emphasize:
- **Faithful reproduction** — match the design, don't reinterpret
- **Email compatibility** — the one thing Claude won't do on its own
- Keep MJML gotchas, drop creative guidance (we want accuracy, not creativity)

---

## Expected Outcome

| Metric | Before | After |
|--------|--------|-------|
| System prompt tokens | ~9,300 | ~3,500 |
| Token reduction | — | ~60% |
| Generic content | ~30% | ~5% |
| Creative freedom | Constrained | Guided |
| Email compatibility | Yes (MJML) | Yes (MJML) |

## Files to Modify

1. `src/prompts/system/email-expert.ts` — rewrite
2. `src/prompts/system/mjml-guide.ts` — rewrite
3. `src/prompts/design-rules/color-usage.ts` — delete
4. `src/prompts/design-rules/typography.ts` — delete
5. `src/prompts/design-rules/spacing.ts` — delete
6. `src/prompts/design-rules/layout-principles.ts` — delete
7. `src/prompts/design-rules/cta-patterns.ts` — delete
8. `src/prompts/design-rules/advanced-effects.ts` — delete
9. `src/prompts/design-rules/index.ts` — rewrite (single export)
10. `src/tools/generate-email.ts` — update prompt assembly
11. `src/tools/screenshot-to-email.ts` — trim MJML reference
12. Tests — update snapshots
