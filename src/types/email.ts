export type EmailType = 'welcome' | 'newsletter' | 'promotional' | 'transactional' | 'custom';

export interface EmailVersion {
  version: number;
  mjml: string;
  html: string;
  feedback?: string;
  section?: string;
  timestamp: string;
}

export interface GeneratedEmail {
  id: string;
  prompt: string;
  type: EmailType;

  mjml: string;
  html: string;

  brandId: string;
  templateUsed?: string;

  validation?: {
    sizeKb: number;
    darkModeCompatible: boolean;
    mobileResponsive: boolean;
    accessibilityScore: number;
  };

  createdAt: string;
  currentVersion: number;
  versions: EmailVersion[];
  refinements: Array<{
    feedback: string;
    timestamp: string;
  }>;
}
