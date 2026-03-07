import { z } from 'zod';
import { loadEmail, saveEmail } from '../lib/storage.js';
import { loadBrand } from '../lib/storage.js';
import { labelSections, extractSection, listSections } from '../lib/section-labeler.js';
import { EMAIL_EXPERT_PROMPT } from '../prompts/system/email-expert.js';
import { MJML_GUIDE_PROMPT } from '../prompts/system/mjml-guide.js';
import { buildBrandContext, buildNoBrandContext } from '../prompts/system/brand-injector.js';

export const refineEmailSchema = z.object({
  email_id: z.string().describe('ID of the email to refine (returned by generate_email)'),
  feedback: z.string().describe('Natural language feedback describing what to change (e.g., "Make the headline bigger", "Change the button color to red")'),
  section: z.string().optional().describe('Target a specific section: header, hero, body, features, cta, testimonial, footer. If omitted, the AI modifies the entire email.'),
  mjml: z.string().optional().describe('The current MJML of this email. Required on first refinement since generate_email returns instructions, not MJML. On subsequent refinements, the stored MJML is used if this is omitted.'),
  version: z.number().optional().describe('Revert to a specific version number before applying this refinement. Useful for undo/branching.'),
});

export async function refineEmailHandler(args: z.infer<typeof refineEmailSchema>) {
  const email = await loadEmail(args.email_id);
  if (!email) {
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({
          success: false,
          error: `Email "${args.email_id}" not found.`,
          hint: 'Use generate_email first to create an email, then refine it with the returned email_id.',
        }, null, 2),
      }],
      isError: true,
    };
  }

  // Determine which MJML to start from
  let currentMjml: string;

  if (args.version !== undefined) {
    // Revert to a specific version
    const targetVersion = email.versions?.find((v) => v.version === args.version);
    if (!targetVersion) {
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            success: false,
            error: `Version ${args.version} not found for email "${args.email_id}".`,
            availableVersions: (email.versions || []).map((v) => v.version),
          }, null, 2),
        }],
        isError: true,
      };
    }
    currentMjml = targetVersion.mjml;
  } else if (args.mjml) {
    // Use provided MJML (first refinement after generate_email)
    currentMjml = args.mjml;
  } else if (email.mjml) {
    // Use stored MJML
    currentMjml = email.mjml;
  } else {
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({
          success: false,
          error: 'No MJML found for this email. Provide the mjml parameter with the current MJML content.',
          hint: 'On first refinement, pass the MJML that was generated from the generate_email instructions.',
        }, null, 2),
      }],
      isError: true,
    };
  }

  // Label sections if not already labeled
  const labeledMjml = labelSections(currentMjml);
  const sections = listSections(labeledMjml);

  // Build brand context
  let brandContext: string;
  if (email.brandId && email.brandId !== 'none') {
    const brand = await loadBrand(email.brandId);
    brandContext = brand ? buildBrandContext(brand) : buildNoBrandContext();
  } else {
    brandContext = buildNoBrandContext();
  }

  // Build the refinement prompt
  let mjmlContext: string;
  let refinementInstruction: string;

  if (args.section) {
    const sectionMjml = extractSection(labeledMjml, args.section as never);
    if (!sectionMjml) {
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            success: false,
            error: `Section "${args.section}" not found in this email.`,
            availableSections: sections,
            hint: 'Use one of the available section names, or omit the section parameter to modify the entire email.',
          }, null, 2),
        }],
        isError: true,
      };
    }

    mjmlContext = `## CURRENT EMAIL (full MJML for context)

\`\`\`mjml
${labeledMjml}
\`\`\`

## TARGET SECTION: ${args.section}

The section to modify:
\`\`\`mjml
${sectionMjml}
\`\`\``;

    refinementInstruction = `Modify ONLY the "${args.section}" section based on this feedback:

"${args.feedback}"

IMPORTANT:
- Output the COMPLETE MJML email (all sections), not just the modified section
- Only change the "${args.section}" section — leave all other sections exactly as they are
- Preserve all section label comments (<!-- section:xxx -->)
- Output ONLY valid MJML code, nothing else
- Start with <mjml> and end with </mjml>`;
  } else {
    mjmlContext = `## CURRENT EMAIL

\`\`\`mjml
${labeledMjml}
\`\`\``;

    refinementInstruction = `Modify this email based on the following feedback:

"${args.feedback}"

IMPORTANT:
- Output the COMPLETE modified MJML email
- Only change what the feedback asks for — preserve everything else
- Preserve all section label comments (<!-- section:xxx -->)
- Output ONLY valid MJML code, nothing else
- Start with <mjml> and end with </mjml>`;
  }

  // Compose system prompt
  const systemPrompt = [
    EMAIL_EXPERT_PROMPT,
    MJML_GUIDE_PROMPT,
    brandContext,
    mjmlContext,
  ].join('\n\n---\n\n');

  // Save the current state as a version before refinement
  const versionNumber = (email.currentVersion || 0) + 1;
  if (!email.versions) {
    email.versions = [];
  }

  // If this is the first refinement and we have MJML, save version 0
  if (email.versions.length === 0 && currentMjml) {
    email.versions.push({
      version: 0,
      mjml: currentMjml,
      html: email.html || '',
      timestamp: email.createdAt,
    });
  }

  // Update email record
  email.mjml = currentMjml;
  email.currentVersion = versionNumber;
  email.refinements.push({
    feedback: args.feedback,
    timestamp: new Date().toISOString(),
  });

  await saveEmail(email);

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(
          {
            success: true,
            emailId: email.id,
            version: versionNumber,
            sections,
            targetSection: args.section || 'entire email',
            message: 'Refinement context prepared. Use the system prompt and instruction below to generate the updated MJML, then call compile_mjml to compile it.',
            systemPrompt,
            userInstruction: refinementInstruction,
            hint: 'After the AI generates the refined MJML, call compile_mjml to get HTML. Then call refine_email again with the new MJML in the mjml parameter to save it and continue iterating.',
            versionHistory: email.versions.map((v) => ({
              version: v.version,
              feedback: v.feedback,
              timestamp: v.timestamp,
            })),
          },
          null,
          2,
        ),
      },
    ],
  };
}
