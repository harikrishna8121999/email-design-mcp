export type SectionName = 'header' | 'hero' | 'body' | 'features' | 'cta' | 'testimonial' | 'footer' | 'unknown';

export interface LabeledSection {
  name: SectionName;
  startIndex: number;
  endIndex: number;
  mjml: string;
}

const SECTION_COMMENT_REGEX = /<!--\s*section:(\w+)\s*-->/gi;

/**
 * Labels MJML sections with comment markers if not already labeled.
 * Detects section types based on content heuristics.
 */
export function labelSections(mjml: string): string {
  // If already labeled, return as-is
  if (SECTION_COMMENT_REGEX.test(mjml)) {
    return mjml;
  }

  const sectionRegex = /<mj-section\b[^>]*>[\s\S]*?<\/mj-section>/gi;
  let result = mjml;
  const sections: Array<{ match: string; label: SectionName }> = [];

  let match;
  while ((match = sectionRegex.exec(mjml)) !== null) {
    sections.push({
      match: match[0],
      label: detectSectionType(match[0], sections.length, sections.length),
    });
  }

  // Count total sections for better heuristics
  for (let i = 0; i < sections.length; i++) {
    sections[i].label = detectSectionType(sections[i].match, i, sections.length);
  }

  // Replace each section with its labeled version
  for (const section of sections) {
    result = result.replace(
      section.match,
      `<!-- section:${section.label} -->\n${section.match}`,
    );
  }

  return result;
}

/**
 * Extracts a specific labeled section from MJML.
 */
export function extractSection(mjml: string, sectionName: SectionName): string | null {
  const regex = new RegExp(
    `<!--\\s*section:${sectionName}\\s*-->\\s*(<mj-section\\b[\\s\\S]*?<\\/mj-section>)`,
    'i',
  );
  const match = regex.exec(mjml);
  return match ? match[1] : null;
}

/**
 * Replaces a specific labeled section in MJML with new content.
 */
export function replaceSection(mjml: string, sectionName: SectionName, newContent: string): string {
  const regex = new RegExp(
    `(<!--\\s*section:${sectionName}\\s*-->\\s*)<mj-section\\b[\\s\\S]*?<\\/mj-section>`,
    'i',
  );
  return mjml.replace(regex, `$1${newContent}`);
}

/**
 * Lists all labeled sections in the MJML.
 */
export function listSections(mjml: string): SectionName[] {
  const regex = /<!--\s*section:(\w+)\s*-->/gi;
  const names: SectionName[] = [];
  let match;
  while ((match = regex.exec(mjml)) !== null) {
    names.push(match[1] as SectionName);
  }
  return names;
}

function detectSectionType(sectionMjml: string, index: number, totalSections: number): SectionName {
  const lower = sectionMjml.toLowerCase();

  // Header: contains logo/nav, usually first
  if (index === 0 && (/logo|nav|menu/i.test(lower) || /<mj-image\b[^>]*>/i.test(lower) && lower.length < 500)) {
    return 'header';
  }

  // Footer: usually last, contains unsubscribe/address/copyright
  if (index === totalSections - 1 && /unsubscribe|copyright|©|address|footer/i.test(lower)) {
    return 'footer';
  }

  // Hero: large image or big heading near the top
  if (index <= 1 && (/hero/i.test(lower) || /<mj-image\b[^>]*width\s*=\s*"600/i.test(lower))) {
    return 'hero';
  }

  // CTA: contains button
  if (/<mj-button\b/i.test(lower) && !/mj-column.*mj-column/i.test(lower)) {
    return 'cta';
  }

  // Features: multiple columns
  if ((lower.match(/<mj-column\b/gi) || []).length >= 2) {
    return 'features';
  }

  // Testimonial: contains quote-like content
  if (/testimonial|quote|review|"[^"]{20,}"/i.test(lower)) {
    return 'testimonial';
  }

  // Default to body
  return 'body';
}
