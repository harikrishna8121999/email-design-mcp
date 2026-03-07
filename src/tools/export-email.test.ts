import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportEmailHandler } from './export-email.js';
import * as storage from '../lib/storage.js';
import type { GeneratedEmail } from '../types/email.js';

vi.mock('../lib/storage.js', () => ({
  loadEmail: vi.fn(),
}));

const SAMPLE_EMAIL: GeneratedEmail = {
  id: 'exp-123',
  prompt: 'Test email',
  type: 'welcome',
  mjml: '<mjml><mj-body><mj-section></mj-section></mj-body></mjml>',
  html: '<html><body>Compiled</body></html>',
  brandId: 'test-brand',
  createdAt: '2024-01-01T00:00:00.000Z',
  currentVersion: 1,
  versions: [
    { version: 0, mjml: '<mjml>v0</mjml>', html: '<html>v0</html>', timestamp: '2024-01-01T00:00:00Z' },
  ],
  refinements: [{ feedback: 'test', timestamp: '2024-01-01T01:00:00Z' }],
};

describe('export_email tool', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return error for non-existent email', async () => {
    vi.mocked(storage.loadEmail).mockResolvedValue(null);
    const result = await exportEmailHandler({ email_id: 'nope' });
    expect(result.isError).toBe(true);
  });

  it('should export both formats by default', async () => {
    vi.mocked(storage.loadEmail).mockResolvedValue(SAMPLE_EMAIL);
    const result = await exportEmailHandler({ email_id: 'exp-123' });
    const data = JSON.parse(result.content[0].text);
    expect(data.success).toBe(true);
    expect(data.html).toBeDefined();
    expect(data.mjml).toBeDefined();
  });

  it('should export only HTML when requested', async () => {
    vi.mocked(storage.loadEmail).mockResolvedValue(SAMPLE_EMAIL);
    const result = await exportEmailHandler({ email_id: 'exp-123', format: 'html' });
    const data = JSON.parse(result.content[0].text);
    expect(data.html).toBeDefined();
    expect(data.mjml).toBeUndefined();
  });

  it('should export only MJML when requested', async () => {
    vi.mocked(storage.loadEmail).mockResolvedValue(SAMPLE_EMAIL);
    const result = await exportEmailHandler({ email_id: 'exp-123', format: 'mjml' });
    const data = JSON.parse(result.content[0].text);
    expect(data.mjml).toBeDefined();
    expect(data.html).toBeUndefined();
  });

  it('should export a specific version', async () => {
    vi.mocked(storage.loadEmail).mockResolvedValue(SAMPLE_EMAIL);
    const result = await exportEmailHandler({ email_id: 'exp-123', version: 0 });
    const data = JSON.parse(result.content[0].text);
    expect(data.html).toContain('v0');
    expect(data.mjml).toContain('v0');
  });
});
