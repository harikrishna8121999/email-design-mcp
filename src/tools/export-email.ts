import { z } from 'zod';
import { loadEmail } from '../lib/storage.js';

export const exportEmailSchema = z.object({
  email_id: z.string().describe('ID of the email to export'),
  format: z.enum(['html', 'mjml', 'both']).optional().describe('Export format. Defaults to "both".'),
  version: z.number().optional().describe('Export a specific version. Defaults to the latest.'),
});

export async function exportEmailHandler(args: z.infer<typeof exportEmailSchema>) {
  const email = await loadEmail(args.email_id);
  if (!email) {
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({
          success: false,
          error: `Email "${args.email_id}" not found.`,
          hint: 'Use generate_email to create an email first.',
        }, null, 2),
      }],
      isError: true,
    };
  }

  let mjml = email.mjml;
  let html = email.html;

  // If a specific version is requested
  if (args.version !== undefined) {
    const targetVersion = (email.versions || []).find((v) => v.version === args.version);
    if (!targetVersion) {
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            success: false,
            error: `Version ${args.version} not found.`,
            availableVersions: (email.versions || []).map((v) => v.version),
          }, null, 2),
        }],
        isError: true,
      };
    }
    mjml = targetVersion.mjml;
    html = targetVersion.html;
  }

  const format = args.format || 'both';

  const result: Record<string, unknown> = {
    success: true,
    emailId: email.id,
    type: email.type,
    prompt: email.prompt,
    brandId: email.brandId,
    version: args.version ?? email.currentVersion ?? 0,
    createdAt: email.createdAt,
    refinementCount: email.refinements.length,
  };

  if (format === 'html' || format === 'both') {
    if (!html) {
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            success: false,
            error: 'No compiled HTML available for this email. Call compile_mjml first.',
          }, null, 2),
        }],
        isError: true,
      };
    }
    result.html = html;
    result.htmlSizeKb = Math.round((Buffer.byteLength(html, 'utf8') / 1024) * 100) / 100;
  }

  if (format === 'mjml' || format === 'both') {
    if (!mjml) {
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            success: false,
            error: 'No MJML source available for this email.',
          }, null, 2),
        }],
        isError: true,
      };
    }
    result.mjml = mjml;
  }

  return {
    content: [{
      type: 'text' as const,
      text: JSON.stringify(result, null, 2),
    }],
  };
}
