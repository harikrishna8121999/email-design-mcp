export const DESIGN_RULES = `## Design Checklist (EVERY email must hit these)

1. **Hero is a showstopper** — gradient bg OR background-url image, min 400px feel, oversized headline (44-56px, weight 900)
2. **No two adjacent sections look the same** — alternate: dark → light → gray → tinted → dark
3. **Typography contrast** — 900-weight headlines vs 300-weight body. Subheadings: 11-13px uppercase, letter-spacing 3-5px
4. **Generous whitespace** — hero 56-64px padding, body 40-48px, CTAs 32-40px breathing room
5. **CTAs are design statements** — pill-shaped (border-radius 50px), 16-18px bold, 40-48px horizontal padding
6. **At least 3 images** — hero bg + product/lifestyle shot + feature icons from the image library. **NEVER use emoji characters as icons** — always use \`<mj-image>\` with URLs from the Image Library.
7. **Dark sections from brand palette** — darken the brand's primary color for dramatic sections (header, footer, accent). Do NOT default to #0f172a unless the brand has no colors. Use the brand's actual primary/secondary darkened 30-50%.
8. **Depth via layering** — dark wrapper → lighter card inner-bg → shadows on cards
9. **Gradient dividers** — thin 3-4px gradient sections instead of mj-divider
10. **Animations as bonus** — @keyframes in mj-style for Apple Mail/iOS, static must look great alone

---

## MJML Recipe Book — Copy These Patterns

### Recipe 1: Gradient Hero with Stacked Typography
\`\`\`mjml
<mj-section css-class="hero-gradient" padding="64px 24px 56px" background-color="PRIMARY_COLOR">
  <mj-column>
    <mj-text align="center" color="ACCENT_COLOR" font-size="11px" font-weight="600" letter-spacing="4px" text-transform="uppercase" padding="0 0 16px">YOUR CATEGORY LABEL</mj-text>
    <mj-text align="center" color="#ffffff" font-size="52px" font-weight="900" line-height="1.05" padding="0 0 20px">Bold Headline<br/>Across Two Lines</mj-text>
    <mj-text align="center" color="rgba(255,255,255,0.7)" font-size="18px" font-weight="300" line-height="1.6" padding="0 40px 28px">One sentence that makes them want to keep reading.</mj-text>
    <mj-button href="#" background-color="ACCENT_COLOR" color="#ffffff" font-size="16px" font-weight="700" border-radius="50px" inner-padding="14px 44px" align="center">Get Started Free</mj-button>
  </mj-column>
</mj-section>
<!-- Pair with this in <mj-style>:
.hero-gradient { background: linear-gradient(135deg, PRIMARY 0%, SECONDARY 50%, ACCENT 100%) !important; } -->
\`\`\`

### Recipe 2: Background Image Hero (more reliable than mj-hero)
\`\`\`mjml
<mj-section background-url="https://images.unsplash.com/photo-1557683316-973673baf926?w=600&h=480&fit=crop" background-size="cover" background-color="#1a1a2e" padding="80px 24px 64px">
  <mj-column>
    <mj-text align="center" color="#ffffff" font-size="48px" font-weight="900" line-height="1.08" padding="0 0 16px">Your Headline Here</mj-text>
    <mj-text align="center" color="rgba(255,255,255,0.8)" font-size="17px" font-weight="300" padding="0 32px 28px">Supporting text on the image.</mj-text>
    <mj-button href="#" background-color="#ffffff" color="#0f172a" font-size="15px" font-weight="700" border-radius="50px" inner-padding="14px 40px" align="center">Learn More</mj-button>
  </mj-column>
</mj-section>
\`\`\`

### Recipe 3: Elevated Cards with Shadow + Icon
**IMPORTANT: Use \`<mj-image>\` with a real URL from the Image Library for icons. NEVER use emoji characters.**
\`\`\`mjml
<mj-section background-color="#f1f5f9" padding="48px 12px">
  <mj-column width="33.33%" padding="8px" inner-background-color="#ffffff" inner-border-radius="16px" css-class="card-shadow">
    <mj-image src="https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=80&h=80&fit=crop" width="56px" alt="Feature icon" padding="24px 0 12px" align="center" />
    <mj-text align="center" font-size="17px" font-weight="800" color="TEXT_COLOR" padding="0 16px 6px">Feature Title</mj-text>
    <mj-text align="center" font-size="13px" font-weight="300" color="#64748b" line-height="1.6" padding="0 16px 24px">Short description of the value this provides.</mj-text>
  </mj-column>
  <!-- Repeat 2 more columns with DIFFERENT icon images from the Image Library -->
</mj-section>
<!-- In <mj-style>: .card-shadow td { box-shadow: 0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04); } -->
\`\`\`

### Recipe 4: Bold Stat / Number Callout
\`\`\`mjml
<mj-section background-color="DARK_BG" padding="48px 24px">
  <mj-column width="33.33%">
    <mj-text align="center" color="ACCENT_COLOR" font-size="44px" font-weight="900" padding="0 0 4px">10x</mj-text>
    <mj-text align="center" color="rgba(255,255,255,0.6)" font-size="12px" font-weight="600" letter-spacing="2px" text-transform="uppercase">Faster Builds</mj-text>
  </mj-column>
  <mj-column width="33.33%">
    <mj-text align="center" color="ACCENT_COLOR" font-size="44px" font-weight="900" padding="0 0 4px">99.9%</mj-text>
    <mj-text align="center" color="rgba(255,255,255,0.6)" font-size="12px" font-weight="600" letter-spacing="2px" text-transform="uppercase">Uptime</mj-text>
  </mj-column>
  <mj-column width="33.33%">
    <mj-text align="center" color="ACCENT_COLOR" font-size="44px" font-weight="900" padding="0 0 4px">50K+</mj-text>
    <mj-text align="center" color="rgba(255,255,255,0.6)" font-size="12px" font-weight="600" letter-spacing="2px" text-transform="uppercase">Happy Users</mj-text>
  </mj-column>
</mj-section>
\`\`\`

### Recipe 5: Pull Quote / Testimonial Breaker
\`\`\`mjml
<mj-section css-class="tinted-bg" background-color="#f0f0ff" padding="48px 40px">
  <mj-column>
    <mj-text align="center" font-size="26px" font-weight="300" font-style="italic" color="PRIMARY_COLOR" line-height="1.5" padding="0 24px 16px">"This changed how our entire team works. We shipped in half the time."</mj-text>
    <mj-text align="center" font-size="11px" font-weight="600" letter-spacing="3px" text-transform="uppercase" color="#94a3b8">SARAH CHEN, VP ENGINEERING</mj-text>
  </mj-column>
</mj-section>
\`\`\`

### Recipe 6: Gradient Divider Strip
\`\`\`mjml
<mj-section css-class="gradient-divider" padding="0" background-color="PRIMARY_COLOR">
  <mj-column><mj-spacer height="4px" /></mj-column>
</mj-section>
<!-- In <mj-style>: .gradient-divider { background: linear-gradient(90deg, PRIMARY, ACCENT, SECONDARY) !important; } -->
\`\`\`

### Recipe 7: Ghost Button on Dark Background
\`\`\`mjml
<mj-button href="#" background-color="transparent" color="ACCENT_COLOR" font-size="15px" font-weight="600" border-radius="50px" border="2px solid ACCENT_COLOR" inner-padding="12px 36px" align="center">Explore Features</mj-button>
\`\`\`

### Recipe 8: Full-Width Product Image with Rounded Corners
\`\`\`mjml
<mj-section background-color="#f8fafc" padding="40px 24px">
  <mj-column>
    <mj-image src="PRODUCT_IMAGE_URL" width="560px" alt="Product screenshot" border-radius="12px" padding="0" css-class="card-shadow" />
  </mj-column>
</mj-section>
\`\`\`

Replace PRIMARY_COLOR, SECONDARY_COLOR, ACCENT_COLOR with the brand's actual hex values.
Replace DARK_BG with a darkened version of the brand's primary color (30-50% darker) — do NOT default to #0f172a.
Replace TEXT_COLOR with the brand's text color.
Replace image URLs with selections from the Image Library — NEVER use emoji characters as icons or decorative elements.`;
