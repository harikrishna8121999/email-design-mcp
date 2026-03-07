import { describe, it, expect } from 'vitest';
import { validateEmailHandler } from './validate-email.js';

describe('validate_email tool', () => {
  it('should return validation results for valid HTML', async () => {
    const result = await validateEmailHandler({
      html: `<!DOCTYPE html>
<html><head><meta name="viewport" content="width=device-width">
<style>:root { color-scheme: light dark; }</style></head>
<body>
<p>Hello world with enough text content to pass ratio checks. More text here to make it substantial enough.</p>
<p>Additional paragraphs of content to ensure we have a good text to image ratio in this email template.</p>
<p>Even more text content for a thorough and well-written email that passes all validation checks properly.</p>
<img src="test.png" alt="Test image" />
<a href="https://example.com">Click</a>
<a href="/unsubscribe">Unsubscribe</a>
</body></html>`,
    });

    const text = result.content[0].text;
    const data = JSON.parse(text);
    expect(data.success).toBe(true);
    expect(data.passed).toBeGreaterThan(0);
    expect(data.checks).toBeInstanceOf(Array);
  });

  it('should detect issues in problematic HTML', async () => {
    const result = await validateEmailHandler({
      html: '<html><body><img src="test.png"><a>no href</a></body></html>',
    });

    const data = JSON.parse(result.content[0].text);
    expect(data.failed).toBeGreaterThan(0);
  });
});
