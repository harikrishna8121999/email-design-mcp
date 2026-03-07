import { describe, it, expect } from 'vitest';
import { labelSections, extractSection, replaceSection, listSections } from './section-labeler.js';

const UNLABELED_MJML = `<mjml>
<mj-body>
  <mj-section>
    <mj-column>
      <mj-image src="logo.png" />
    </mj-column>
  </mj-section>
  <mj-section>
    <mj-column>
      <mj-image src="hero.png" width="600px" />
      <mj-text font-size="28px">Welcome!</mj-text>
    </mj-column>
  </mj-section>
  <mj-section>
    <mj-column>
      <mj-text>Some body content here.</mj-text>
    </mj-column>
  </mj-section>
  <mj-section>
    <mj-column>
      <mj-text>Copyright 2024. <a href="/unsubscribe">Unsubscribe</a></mj-text>
    </mj-column>
  </mj-section>
</mj-body>
</mjml>`;

const LABELED_MJML = `<mjml>
<mj-body>
  <!-- section:header -->
  <mj-section>
    <mj-column><mj-image src="logo.png" /></mj-column>
  </mj-section>
  <!-- section:hero -->
  <mj-section>
    <mj-column><mj-text>Big headline</mj-text></mj-column>
  </mj-section>
  <!-- section:footer -->
  <mj-section>
    <mj-column><mj-text>Footer content</mj-text></mj-column>
  </mj-section>
</mj-body>
</mjml>`;

describe('labelSections', () => {
  it('should add section labels to unlabeled MJML', () => {
    const result = labelSections(UNLABELED_MJML);
    expect(result).toContain('<!-- section:');
    expect(result).toContain('<mj-section');
  });

  it('should not re-label already labeled MJML', () => {
    const result = labelSections(LABELED_MJML);
    expect(result).toBe(LABELED_MJML);
  });

  it('should detect footer section', () => {
    const result = labelSections(UNLABELED_MJML);
    expect(result).toContain('<!-- section:footer -->');
  });
});

describe('extractSection', () => {
  it('should extract a labeled section', () => {
    const section = extractSection(LABELED_MJML, 'hero');
    expect(section).toContain('Big headline');
    expect(section).toMatch(/^<mj-section/);
  });

  it('should return null for non-existent section', () => {
    const section = extractSection(LABELED_MJML, 'cta');
    expect(section).toBeNull();
  });
});

describe('replaceSection', () => {
  it('should replace a specific section', () => {
    const newSection = '<mj-section><mj-column><mj-text>New hero</mj-text></mj-column></mj-section>';
    const result = replaceSection(LABELED_MJML, 'hero', newSection);
    expect(result).toContain('New hero');
    expect(result).not.toContain('Big headline');
    expect(result).toContain('<!-- section:hero -->');
  });
});

describe('listSections', () => {
  it('should list all section names', () => {
    const sections = listSections(LABELED_MJML);
    expect(sections).toEqual(['header', 'hero', 'footer']);
  });

  it('should return empty array for unlabeled MJML', () => {
    const sections = listSections(UNLABELED_MJML);
    expect(sections).toEqual([]);
  });
});
