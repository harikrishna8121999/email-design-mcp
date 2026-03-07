import { describe, it, expect, vi, beforeEach } from 'vitest';
import { refineEmailHandler } from './refine-email.js';
import * as storage from '../lib/storage.js';
import type { GeneratedEmail } from '../types/email.js';

vi.mock('../lib/storage.js', () => ({
  loadEmail: vi.fn(),
  saveEmail: vi.fn(),
  loadBrand: vi.fn(),
}));

const SAMPLE_MJML = `<mjml>
<mj-body>
  <!-- section:header -->
  <mj-section>
    <mj-column><mj-image src="logo.png" /></mj-column>
  </mj-section>
  <!-- section:hero -->
  <mj-section>
    <mj-column><mj-text font-size="28px">Welcome!</mj-text></mj-column>
  </mj-section>
  <!-- section:footer -->
  <mj-section>
    <mj-column><mj-text>Footer</mj-text></mj-column>
  </mj-section>
</mj-body>
</mjml>`;

const SAMPLE_EMAIL: GeneratedEmail = {
  id: 'test-123',
  prompt: 'Welcome email',
  type: 'welcome',
  mjml: SAMPLE_MJML,
  html: '<html>compiled</html>',
  brandId: 'none',
  createdAt: '2024-01-01T00:00:00.000Z',
  currentVersion: 0,
  versions: [],
  refinements: [],
};

describe('refine_email tool', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return error for non-existent email', async () => {
    vi.mocked(storage.loadEmail).mockResolvedValue(null);

    const result = await refineEmailHandler({
      email_id: 'nonexistent',
      feedback: 'Make it bigger',
    });

    expect(result.isError).toBe(true);
    const data = JSON.parse(result.content[0].text);
    expect(data.error).toContain('not found');
  });

  it('should prepare refinement context for full email', async () => {
    vi.mocked(storage.loadEmail).mockResolvedValue({ ...SAMPLE_EMAIL });
    vi.mocked(storage.saveEmail).mockResolvedValue(undefined);

    const result = await refineEmailHandler({
      email_id: 'test-123',
      feedback: 'Make the headline bigger',
    });

    const data = JSON.parse(result.content[0].text);
    expect(data.success).toBe(true);
    expect(data.emailId).toBe('test-123');
    expect(data.systemPrompt).toContain(SAMPLE_MJML);
    expect(data.userInstruction).toContain('Make the headline bigger');
    expect(data.targetSection).toBe('entire email');
  });

  it('should support section-level targeting', async () => {
    vi.mocked(storage.loadEmail).mockResolvedValue({ ...SAMPLE_EMAIL });
    vi.mocked(storage.saveEmail).mockResolvedValue(undefined);

    const result = await refineEmailHandler({
      email_id: 'test-123',
      feedback: 'Change the logo',
      section: 'header',
    });

    const data = JSON.parse(result.content[0].text);
    expect(data.success).toBe(true);
    expect(data.targetSection).toBe('header');
    expect(data.userInstruction).toContain('"header"');
  });

  it('should return error for invalid section name', async () => {
    vi.mocked(storage.loadEmail).mockResolvedValue({ ...SAMPLE_EMAIL });

    const result = await refineEmailHandler({
      email_id: 'test-123',
      feedback: 'Change it',
      section: 'nonexistent',
    });

    const data = JSON.parse(result.content[0].text);
    expect(data.success).toBe(false);
    expect(data.error).toContain('not found');
    expect(data.availableSections).toBeInstanceOf(Array);
  });

  it('should accept MJML parameter for first refinement', async () => {
    const emailNoMjml = { ...SAMPLE_EMAIL, mjml: '' };
    vi.mocked(storage.loadEmail).mockResolvedValue(emailNoMjml);
    vi.mocked(storage.saveEmail).mockResolvedValue(undefined);

    const result = await refineEmailHandler({
      email_id: 'test-123',
      feedback: 'Make it red',
      mjml: SAMPLE_MJML,
    });

    const data = JSON.parse(result.content[0].text);
    expect(data.success).toBe(true);
  });

  it('should support version revert', async () => {
    const emailWithVersions = {
      ...SAMPLE_EMAIL,
      currentVersion: 2,
      versions: [
        { version: 0, mjml: '<mjml><mj-body>v0</mj-body></mjml>', html: '', timestamp: '2024-01-01T00:00:00Z' },
        { version: 1, mjml: '<mjml><mj-body>v1</mj-body></mjml>', html: '', timestamp: '2024-01-01T01:00:00Z' },
      ],
    };
    vi.mocked(storage.loadEmail).mockResolvedValue(emailWithVersions);
    vi.mocked(storage.saveEmail).mockResolvedValue(undefined);

    const result = await refineEmailHandler({
      email_id: 'test-123',
      feedback: 'Redo this',
      version: 0,
    });

    const data = JSON.parse(result.content[0].text);
    expect(data.success).toBe(true);
    expect(data.systemPrompt).toContain('v0');
  });
});
