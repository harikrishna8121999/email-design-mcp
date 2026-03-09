import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { loadBrand, listBrands, saveEmail } from '../lib/storage.js';
import { buildBrandContext, buildNoBrandContext } from '../prompts/system/brand-injector.js';
import { buildImageLibraryPrompt } from '../prompts/system/image-library.js';
import type { GeneratedEmail } from '../types/email.js';

/**
 * Dedicated system prompt for screenshot-to-email reproduction.
 * Does NOT include EMAIL_EXPERT_PROMPT or DESIGN_RULES — those push
 * creative maximalism which fights against faithful reproduction.
 * Instead, includes only the MJML technical reference needed to produce valid output.
 */
const SCREENSHOT_SYSTEM_PROMPT = `You are a precise email coder. Translate a visual email design into valid MJML that reproduces the design faithfully. Do NOT add creative embellishments or "improve" the design.

## MJML Essentials
- Structure: \`<mjml>\` > \`<mj-head>\` + \`<mj-body>\` > \`<mj-section>\` > \`<mj-column>\` > content
- Use \`<mj-attributes>\` for global defaults, \`<mj-style>\` for CSS (gradients, dark mode)
- Use \`css-class\` for gradients — ALWAYS pair with \`background-color\` fallback for Outlook
- Use hex for borders (not rgba — Outlook ignores it)
- Don't nest sections inside columns. Max 4 columns per section.
- Use \`mj-wrapper\` for shared backgrounds across sections, \`mj-hero\` for background images.

## Reproduction Rules
1. **Count every element** — 3 images in design = 3 images in code. Never skip or merge.
2. **Match colors from the SCREENSHOT, not from any brand profile** — background, text, button colors. Extract exact hex values from the description. Purple means purple, not orange. Don't substitute brand colors.
3. **Match typography** — size, weight, style. Don't inflate sizes or add bold where there is none.
4. **Match layout** — full-width vs multi-column. Don't rearrange.
5. **Match border-radius** — square = 0, rounded = estimate. Don't add rounding that isn't there.
6. **Use real images from the Image Library** — pick images that match the mood/content of the original. Use placehold.co ONLY for brand-specific logos or product images that nothing in the library matches.
7. **Every image in the design MUST appear in the code** — hero backgrounds, product shots, feature icons, lifestyle photos. If the design has a photo of someone writing, include an image. If it has icons for features, include icon images.

## Hero Section Patterns — CRITICAL
If the design shows **text overlaid on top of an image** (text sitting on a photo/image background):
- Use \`<mj-section background-url="IMAGE_URL" background-size="cover" background-color="FALLBACK_COLOR">\` with text content inside
- OR use \`<mj-hero mode="fluid" background-url="IMAGE_URL" background-color="FALLBACK_COLOR">\`
- Do NOT stack the image and text as separate elements — the text must be ON TOP of the image
- If there's a dark overlay on the image, use a dark \`background-color\` as fallback

If the design shows an image and text as **separate stacked blocks** (image above, text below):
- Use a separate \`<mj-image>\` followed by a text section
- Do NOT merge them into a background-url pattern

## Do NOT:
- Add animations, hover effects, or gradient backgrounds unless the design shows them
- Add decorative elements (dot patterns, glow, glass morphism) not in the design
- "Enhance" a simple design — keep it simple
- Add letter-spacing or text-transform unless the design shows it
- Use colored text blocks or letter squares as substitutes for icons — use actual \`<mj-image>\` elements
- Skip images that are present in the original design

## Common Mistakes
1. **Dark theme → light midway**: If the email is dark-themed, EVERY section stays dark. Set background-color on mj-body AND every section. Don't switch to white midway.
2. **Losing mixed-style text**: Use \`<em>\` or inline \`<span>\` for specific italic words — don't make everything italic or everything regular.
3. **Wrong social icons**: Match the style — outline circles on dark vs colored brand icons via mj-social.
4. **Conventional defaults**: Not all emails are light-bodied with gray footers. Reproduce what's DESCRIBED.
5. **Missing images**: The #1 reproduction failure is omitting images. If the design has a hero photo, feature icons, or product images — they MUST appear as \`<mj-image>\` in the output. Text-only output for a design with images is a FAILURE.
6. **Stacking instead of overlaying**: If text appears ON TOP of an image (like a hero banner), use \`background-url\` on the section — do NOT put the image as a separate \`<mj-image>\` above the text. This completely changes the layout.
7. **Using brand colors instead of screenshot colors**: The screenshot shows purple accents? Use purple. Don't substitute orange/red/blue from a brand profile. The screenshot is the source of truth for colors.`;

export const screenshotToEmailSchema = z.object({
  image_description: z.union([
    z.string(),
    z.array(z.string()).min(1),
  ]).describe('Detailed description of the email design to recreate. MUST include for EACH section: (1) background color (dark/light/specific color), (2) text colors, (3) layout structure, (4) number and arrangement of images, (5) button styles. Especially note if the email is DARK-THEMED throughout — state this explicitly. Pass a single string, or an array of strings for multiple screenshots.'),
  brand_id: z.string().optional().describe('Brand profile ID to use for colors/fonts. Uses the most recently updated brand if not specified.'),
  type: z.enum(['welcome', 'newsletter', 'promotional', 'transactional', 'custom']).optional().describe('Email type. Auto-detected if not specified.'),
});

export async function screenshotToEmailHandler(args: z.infer<typeof screenshotToEmailSchema>) {
  // For screenshot reproduction, brand colors should NOT override the design.
  // Only load brand if explicitly requested — otherwise use a neutral context
  // that tells the AI to extract colors from the screenshot description.
  let brandContext: string;
  let brandId = 'none';

  if (args.brand_id) {
    const brand = await loadBrand(args.brand_id);
    if (!brand) {
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            success: false,
            error: `Brand "${args.brand_id}" not found.`,
            hint: 'Use setup_brand to create a brand profile first, or omit brand_id.',
          }, null, 2),
        }],
        isError: true,
      };
    }
    // Even with a brand, tell the AI to prioritize screenshot colors
    brandContext = `## BRAND REFERENCE (secondary to screenshot)
Brand "${brand.name}" is available for logo/font fallbacks, but **the screenshot's actual colors take priority**.
- Logo: ${brand.logo || 'none'}
- Heading font: ${brand.fonts.heading}
- Body font: ${brand.fonts.body}

**DO NOT override the screenshot's colors with brand colors. Match the screenshot exactly.**`;
    brandId = brand.id;
  } else {
    brandContext = `## BRAND CONTEXT
No brand specified. Extract ALL colors, fonts, and styling directly from the screenshot description. Match them exactly — do not default to generic blue/indigo palettes.`;
  }

  const emailType = args.type || 'custom';

  // Normalize image_description to a combined string
  const descriptions = Array.isArray(args.image_description)
    ? args.image_description
    : [args.image_description];
  const combinedDescription = descriptions.length === 1
    ? descriptions[0]
    : descriptions.map((d, i) => `[Screenshot ${i + 1} of ${descriptions.length}]:\n${d}`).join('\n\n');

  // Screenshot tool uses a DEDICATED system prompt — not the creative EMAIL_EXPERT_PROMPT.
  // The creative prompts (animations, gradients, massive fonts) actively fight against
  // faithful reproduction. Instead, we include only MJML technical reference + reproduction rules + image library.
  const imageLibrary = buildImageLibraryPrompt();
  const systemPrompt = [
    SCREENSHOT_SYSTEM_PROMPT,
    imageLibrary,
    brandContext,
    descriptions.length > 1
      ? `\n## MULTI-SCREENSHOT: The design is described across ${descriptions.length} sequential screenshots — combine them into a single cohesive email.`
      : '',
  ].join('\n\n---\n\n');

  const userInstruction = `Recreate this email design as production-ready MJML.

DESIGN DESCRIPTION:
"${combinedDescription}"

Email type: ${emailType}

BEFORE WRITING CODE, you MUST analyze the design section-by-section. For EACH section, note:
- What is the BACKGROUND COLOR? (dark navy? white? light gray? colored?)
- What is the TEXT COLOR? (white on dark? black on light? colored?)
- Is this section part of an overall DARK THEME or LIGHT THEME?

Then fill in this mental checklist:
1. Overall theme: Is this email predominantly dark-themed or light-themed?
2. mj-body background-color: What should it be?
3. For EACH section (hero, body, features, CTA, footer): What is its background-color?
4. **Hero layout: Is text OVERLAID on an image (use background-url) or STACKED below an image (use separate mj-image)?** This is the #1 thing people get wrong.
5. Images: How many? What layout? What border-radius?
6. Buttons: How many? Filled/ghost/outline? What EXACT colors from the screenshot?
7. Typography: Serif or sans-serif? Any italic or mixed-style text?
8. **Colors: What are the EXACT colors visible in the screenshot?** List specific hex approximations. Do NOT use brand profile colors — match the screenshot.

CRITICAL: If the email is dark-themed, EVERY section must have a dark background-color. Do NOT switch to white/light backgrounds midway through.

Then generate MJML that matches ALL observations. Output ONLY valid MJML — start with <mjml>, end with </mjml>.
- Add section label comments (<!-- section:header -->, <!-- section:hero -->, etc.)
- Use real images from the Image Library that match the mood/content of the original design
- Every image visible in the original design MUST have a corresponding <mj-image> — do NOT replace images with text, colored blocks, or emoji
- For hero/background images, use mj-section with background-url or mj-hero
- For feature icons, use <mj-image> with appropriately sized images from the library (NOT emoji or text letters)
- Include an unsubscribe link in the footer`;

  // Create email record
  const emailId = randomUUID().slice(0, 8);
  const email: GeneratedEmail = {
    id: emailId,
    prompt: `[Screenshot recreation] ${combinedDescription.slice(0, 200)}`,
    type: emailType,
    mjml: '',
    html: '',
    brandId,
    createdAt: new Date().toISOString(),
    currentVersion: 0,
    versions: [],
    refinements: [],
  };

  await saveEmail(email);

  return {
    content: [{
      type: 'text' as const,
      text: JSON.stringify({
        success: true,
        emailId,
        emailType,
        brandId,
        nextStep: 'GENERATE MJML DIRECTLY — do NOT call any external API. Read the design guidelines and user instruction below, then write MJML code yourself in the conversation. After generating the MJML, call the compile_mjml tool with it to get HTML.',
        designGuidelines: systemPrompt,
        userInstruction,
      }, null, 2),
    }],
  };
}
