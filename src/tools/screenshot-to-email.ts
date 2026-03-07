import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { loadBrand, listBrands, saveEmail } from '../lib/storage.js';
import { EMAIL_EXPERT_PROMPT } from '../prompts/system/email-expert.js';
import { MJML_GUIDE_PROMPT } from '../prompts/system/mjml-guide.js';
import { buildBrandContext, buildNoBrandContext } from '../prompts/system/brand-injector.js';
import { DESIGN_RULES } from '../prompts/design-rules/index.js';
import type { GeneratedEmail } from '../types/email.js';

export const screenshotToEmailSchema = z.object({
  image_description: z.string().describe('Detailed description of the email design/screenshot to recreate. Describe the layout, colors, sections, text content, images, buttons, and overall style.'),
  brand_id: z.string().optional().describe('Brand profile ID to use for colors/fonts. Uses the most recently updated brand if not specified.'),
  type: z.enum(['welcome', 'newsletter', 'promotional', 'transactional', 'custom']).optional().describe('Email type. Auto-detected if not specified.'),
});

export async function screenshotToEmailHandler(args: z.infer<typeof screenshotToEmailSchema>) {
  // Load brand context
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
    brandContext = buildBrandContext(brand);
    brandId = brand.id;
  } else {
    const brands = await listBrands();
    if (brands.length > 0) {
      const latest = brands.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
      brandContext = buildBrandContext(latest);
      brandId = latest.id;
    } else {
      brandContext = buildNoBrandContext();
    }
  }

  const emailType = args.type || 'custom';

  const systemPrompt = [
    EMAIL_EXPERT_PROMPT,
    MJML_GUIDE_PROMPT,
    DESIGN_RULES,
    brandContext,
    `## TASK: Recreate Email from Design Description

You are recreating an email design from a visual description. Match the described layout, structure, and style as closely as possible while ensuring the output is valid, responsive MJML.

Key principles:
- Match the described layout structure precisely (columns, sections, ordering)
- Use the brand colors/fonts from the brand context, but if the description specifies different colors, prefer the description
- Ensure responsive behavior (single column on mobile)
- Add section label comments (<!-- section:header -->, <!-- section:hero -->, etc.)
- Use placeholder images from https://placehold.co/ matching the described dimensions
- Maintain accessibility (alt text, contrast, semantic structure)`,
  ].join('\n\n---\n\n');

  const userInstruction = `Recreate this email design as production-ready MJML:

DESIGN DESCRIPTION:
"${args.image_description}"

Email type: ${emailType}

IMPORTANT:
- Output ONLY valid MJML code, nothing else
- Start with <mjml> and end with </mjml>
- Match the described layout as closely as possible
- Add section label comments (<!-- section:header -->, <!-- section:hero -->, etc.)
- Use placeholder images from https://placehold.co/ with appropriate dimensions
- Include an unsubscribe link in the footer`;

  // Create email record
  const emailId = randomUUID().slice(0, 8);
  const email: GeneratedEmail = {
    id: emailId,
    prompt: `[Screenshot recreation] ${args.image_description.slice(0, 200)}`,
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
        message: 'Screenshot-to-email context prepared. Use the system prompt and instruction below to generate MJML, then call compile_mjml to compile it.',
        systemPrompt,
        userInstruction,
        hint: 'The host AI should use its vision capabilities to understand the design description, then generate matching MJML. Call compile_mjml with the output to get HTML.',
      }, null, 2),
    }],
  };
}
