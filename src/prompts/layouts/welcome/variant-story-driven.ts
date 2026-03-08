export const WELCOME_STORY_DRIVEN = {
  name: 'story-driven',
  description: 'Rich editorial layout with large imagery, social proof, and warm storytelling',
  instructions: `### Layout: Story-Driven Editorial

Structure the email in this exact order:

1. **Brand header** — Dark secondary background, white text brand name, compact padding. Clean and confident.

2. **Hero with large image** — Use mj-hero with a lifestyle/product background image:
   - background-url pointing to a placehold.co image (600x400, dark themed)
   - Warm, personal headline: 36-44px, weight 900, white — "Hey there, welcome to [Brand]"
   - Short subtitle in softer white (weight 300, 70% opacity)
   - Pill-shaped CTA button in accent color

3. **Personal story section** — White background, generous padding:
   - A pull quote or founder message in large text (22-24px, weight 300, slight italic, brand color)
   - 2-3 sentences of warm personal copy below (15px, weight 300, slate gray, line-height 1.7)
   - This should feel human and genuine, not corporate

4. **Full-width product image** — Large screenshot or illustration (560x300+ placeholder). Light gray background. Border-radius 12px on image. This provides visual weight and credibility.

5. **Value prop cards** — 3 card columns on light gray background:
   - White cards, 16px border-radius, subtle border
   - Icon images (48-64px from image library) — NEVER use emoji characters
   - Bold titles (17px, weight 800) + light descriptions (14px, weight 300)

6. **Social proof strip** — Light background:
   - "Trusted by teams at" label (11px, uppercase, letter-spacing 3px, muted)
   - 4-column logo bar using placeholder company logo images

7. **Getting started steps** — White background, wrapped in mj-wrapper:
   - 3 numbered steps with gradient-colored number circles (inline span with border-radius 50%)
   - Step title (16px, weight 700) + description (14px, weight 300)
   - Visual progression guides the reader forward

8. **Warm sign-off** — Light tinted background:
   - Warm closing: "We're thrilled to have you" + team name bold
   - Help/reply prompt in smaller text

9. **Dark footer** — Near-black background with brand name, social icons, divider, legal text, accent-colored unsubscribe link.

Design notes:
- This layout uses IMAGES as a core design element — include at least 3 images (hero bg, product screenshot, feature icons)
- The social proof section adds credibility and visual weight
- Mix large imagery with text-rich sections for editorial feel
- Warm tone + premium visual design = emails people actually enjoy reading
- Alternate: dark -> image -> white -> gray -> white -> gray -> tinted -> dark`,
};
