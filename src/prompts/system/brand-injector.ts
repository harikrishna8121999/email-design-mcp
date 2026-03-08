import type { BrandProfile } from '../../types/brand.js';

/**
 * Darken a hex color by a given factor (0-1).
 * factor=0.4 means 40% darker.
 */
function darkenHex(hex: string, factor: number): string {
  const h = hex.replace('#', '');
  const r = Math.round(parseInt(h.substring(0, 2), 16) * (1 - factor));
  const g = Math.round(parseInt(h.substring(2, 4), 16) * (1 - factor));
  const b = Math.round(parseInt(h.substring(4, 6), 16) * (1 - factor));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function buildBrandContext(brand: BrandProfile): string {
  return `## BRAND CONTEXT: ${brand.name}

**MANDATORY: You MUST use these exact brand colors throughout the email. Do NOT substitute generic blues/purples/indigos. The hero gradient, CTA buttons, accent elements, and links must all use these specific hex values.**

### Colors (USE THESE EXACT HEX VALUES)
- Primary: ${brand.colors.primary} — USE for hero gradients, key highlights, section backgrounds
- Secondary: ${brand.colors.secondary} — USE for gradient endpoints, supporting sections
- Accent: ${brand.colors.accent} — USE for CTAs, links, interactive elements
- Dark BG: ${darkenHex(brand.colors.primary, 0.4)} — USE for dark dramatic sections (header, footer, stat bars). Derived from primary.
- Background: ${brand.colors.background}
- Text: ${brand.colors.text}

### Typography
- Heading: ${brand.fonts.heading}, 'Helvetica Neue', Arial, sans-serif
- Body: ${brand.fonts.body}, 'Helvetica Neue', Arial, sans-serif

${brand.logo ? `### Logo\nUse this logo image in the header: ${brand.logo}` : '### Logo\nNo logo — use bold text header with brand name.'}

### Voice
- Industry: ${brand.industry}
- Audience: ${brand.audience}
- Tone: ${brand.tone}`;
}

export function buildNoBrandContext(): string {
  return `## BRAND CONTEXT

No brand profile configured. Use a modern default:
- Primary: #6366f1 (indigo) | Secondary: #8b5cf6 (violet) | Accent: #a78bfa
- Background: #ffffff | Text: #0f172a
- Font: 'Helvetica Neue', Arial, sans-serif
- Tone: modern, confident, warm

Set up a brand profile with \`setup_brand\` for personalized emails.`;
}
