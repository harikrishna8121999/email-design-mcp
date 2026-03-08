import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screenshotToEmailHandler } from './screenshot-to-email.js';
import * as storage from '../lib/storage.js';

vi.mock('../lib/storage.js', () => ({
  loadBrand: vi.fn(),
  listBrands: vi.fn(),
  saveEmail: vi.fn(),
}));

describe('screenshot_to_email tool', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(storage.listBrands).mockResolvedValue([]);
    vi.mocked(storage.saveEmail).mockResolvedValue(undefined);
  });

  it('should prepare context from image description', async () => {
    const result = await screenshotToEmailHandler({
      image_description: 'A clean welcome email with a large hero image at the top, a headline saying "Welcome aboard", three feature columns below, and a blue CTA button.',
    });

    const data = JSON.parse(result.content[0].text);
    expect(data.success).toBe(true);
    expect(data.emailId).toBeDefined();
    expect(data.designGuidelines).toContain('Reproduction Rules');
    expect(data.userInstruction).toContain('Welcome aboard');
  });

  it('should return error for non-existent brand', async () => {
    vi.mocked(storage.loadBrand).mockResolvedValue(null);

    const result = await screenshotToEmailHandler({
      image_description: 'A simple email',
      brand_id: 'nonexistent',
    });

    expect(result.isError).toBe(true);
  });

  it('should use latest brand when none specified', async () => {
    vi.mocked(storage.listBrands).mockResolvedValue([
      {
        id: 'acme',
        name: 'Acme',
        url: '',
        colors: { primary: '#FF0000', secondary: '#00FF00', accent: '#0000FF', background: '#ffffff', text: '#000000' },
        fonts: { heading: 'Arial', body: 'Arial' },
        industry: 'tech',
        audience: 'developers',
        tone: 'professional' as const,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ]);

    const result = await screenshotToEmailHandler({
      image_description: 'A newsletter with 3 articles',
    });

    const data = JSON.parse(result.content[0].text);
    expect(data.brandId).toBe('acme');
  });
});
