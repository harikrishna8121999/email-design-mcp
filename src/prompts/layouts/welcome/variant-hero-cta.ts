export const WELCOME_HERO_CTA = {
  name: 'hero-cta',
  description: 'Cinematic hero with gradient background, oversized typography, product imagery, and premium cards',
  instructions: `### Layout: Cinematic Hero + CTA

Structure the email in this exact order:

1. **Slim header bar** — Brand name on dark (near-black #0f172a) background. Compact (16px vertical padding). White text, 18px bold. Optional: small brand icon/image to the left.

2. **CINEMATIC HERO** — This is the WOW moment. Use either:
   - A CSS gradient background (via css-class + mj-style): e.g., linear-gradient(135deg, primary 0%, secondary 100%)
   - OR mj-hero with a dark background-url image and overlay
   - Minimum visual height: 400px+
   - Small uppercase label at top: 11px, letter-spacing 4px, accent color — acts as a design element
   - MASSIVE headline: 48-56px, font-weight 900, line-height 1.05, white — break across 2 lines for visual impact
   - Subtitle: 18px, font-weight 300, white at 70% opacity — keep it to 1-2 lines
   - Primary CTA: pill-shaped (border-radius 50px), accent color bg, 16px bold text, generous padding
   - Optional: ghost button next to/below primary CTA

3. **Product screenshot** — Full-width section with a large product image (560x320+ placeholder showing a dashboard/app UI). Use border-radius 12px on the image. Light gray background section. This SINGLE IMAGE makes the email 10x more professional.

4. **Feature cards** — Use a SINGLE mj-section with 3 mj-columns (width="33.33%" each):
   - Use mj-column attributes: inner-background-color="#ffffff", inner-border="1px solid #e2e8f0", inner-border-radius="16px"
   - Section background-color="#f1f5f9"
   - Each column contains: mj-image (48-64px icon from image library — NOT an emoji), mj-text for bold title (16px, weight 800), mj-text for description (13px, weight 300, slate gray)
   - Column padding="8px" for gutters between cards

5. **Pull quote / testimonial** — Light tinted background (brand at 5-10%):
   - Large italic quote (24-26px, weight 300, brand color)
   - Attribution below: 12px uppercase, letter-spacing 2px, muted
   - This section acts as a visual breather

6. **Secondary CTA section** — White or dark background:
   - Motivating headline (24-28px, weight 800)
   - Short supporting text (15px, weight 300)
   - Primary button (pill-shaped, accent/primary color)

7. **Dark footer** — Near-black (#0f172a) background:
   - Brand name (18px bold white)
   - Tagline (13px muted slate)
   - Social icons via mj-social
   - Thin divider
   - Legal text (11px, very muted) + accent-colored unsubscribe link

Design notes:
- The gradient hero + product screenshot combo is what makes this look agency-designed
- Use AT LEAST 6 visually distinct sections with different treatments
- Include gradient definitions in mj-style using css-class
- Typography contrast: 900-weight headlines vs 300-weight body
- Include at least 2-3 images (product screenshot + feature icons)
- Do NOT use emoji characters anywhere — use images from the library for icons
- The email should look like it belongs on ReallyGoodEmails.com`,
};
