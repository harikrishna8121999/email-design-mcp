export const MJML_GUIDE_PROMPT = `## MJML Production Gotchas

### Outlook Compatibility (CRITICAL)
- **ALWAYS set \`background-color\` on any section using a \`css-class\` gradient** — Outlook ignores CSS gradients but renders the inline fallback.
- **Solid hex colors for borders** — Outlook doesn't support rgba(). Use \`#94a3b8\` not \`rgba(255,255,255,0.4)\`.
- **box-shadow** is ignored in Outlook — use for enhancement only.
- **mj-hero background images**: MJML auto-generates VML fallback — trust it. But \`mj-section\` with \`background-url\` is more reliable across Yahoo/AOL.

### CSS-in-Email Rules
- Gradients, animations, hover effects → \`<mj-style>\` via \`css-class\`, NOT inline styles.
- \`@keyframes\` in \`<mj-style>\`: works in Apple Mail, iOS, Samsung Mail. Gmail/Outlook ignore gracefully.
- Use \`<mj-attributes>\` in \`<mj-head>\` for DRY global defaults (font-family, text color, line-height).
- \`mj-wrapper\` groups multiple sections with shared background — use for full-width colored bands.
- Dark mode: \`@media (prefers-color-scheme: dark)\` in mj-style + \`[data-ogsc]\` for Outlook dark mode.

### Structure Rules
- DON'T nest \`<mj-section>\` inside \`<mj-column>\` — sections are top-level only.
- DON'T use raw HTML outside of \`<mj-text>\` or \`<mj-raw>\`.
- DON'T use CSS flexbox/grid — MJML handles layout via tables.
- DON'T use \`<style>\` — use \`<mj-style>\`.
- DON'T use a css-class gradient WITHOUT also setting background-color.
- DON'T exceed 4 columns in a single section.
- For multi-column cards: use \`inner-background-color\`, \`inner-border\`, \`inner-border-radius\` on mj-column (see Recipe 3 in Design Rules).`;
