import { z } from 'zod';
import { validateEmail } from '../lib/email-validator.js';

export const validateEmailSchema = z.object({
  html: z.string().describe('Compiled HTML email to validate'),
});

export async function validateEmailHandler(args: z.infer<typeof validateEmailSchema>) {
  const result = validateEmail(args.html);

  const summary = result.failed > 0
    ? `${result.failed} issue(s) found that should be fixed.`
    : result.warnings > 0
      ? `No critical issues. ${result.warnings} warning(s) to review.`
      : 'All checks passed!';

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(
          {
            success: true,
            summary,
            score: `${result.accessibilityScore}/100`,
            sizeKb: result.sizeKb,
            darkModeCompatible: result.darkModeCompatible,
            mobileResponsive: result.mobileResponsive,
            passed: result.passed,
            failed: result.failed,
            warnings: result.warnings,
            checks: result.checks,
          },
          null,
          2,
        ),
      },
    ],
  };
}
