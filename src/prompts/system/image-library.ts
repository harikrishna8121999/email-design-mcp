/**
 * Curated library of free, open-source images from Unsplash.
 * All images are free for commercial use (Unsplash license).
 * URLs use Unsplash's image CDN with resize parameters for email optimization.
 *
 * Usage: The AI selects contextually appropriate images from these categories
 * instead of using bland placehold.co boxes.
 */

export interface ImageEntry {
  url: string;
  alt: string;
  tags: string[];
}

export interface ImageCategory {
  name: string;
  description: string;
  images: ImageEntry[];
}

const HERO_BACKGROUNDS: ImageCategory = {
  name: 'Hero Backgrounds',
  description: 'Full-width cinematic backgrounds for hero sections (600px wide)',
  images: [
    {
      url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=600&h=480&fit=crop',
      alt: 'Abstract gradient waves',
      tags: ['abstract', 'gradient', 'modern', 'tech'],
    },
    {
      url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&h=480&fit=crop',
      alt: 'Colorful gradient mesh',
      tags: ['gradient', 'colorful', 'vibrant', 'creative'],
    },
    {
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=480&fit=crop',
      alt: 'Abstract 3D shapes',
      tags: ['3d', 'abstract', 'modern', 'creative'],
    },
    {
      url: 'https://images.unsplash.com/photo-1634017839464-5c339afa0df4?w=600&h=480&fit=crop',
      alt: 'Neon light trails',
      tags: ['neon', 'dark', 'tech', 'gaming'],
    },
    {
      url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&h=480&fit=crop',
      alt: 'Purple gradient abstract',
      tags: ['gradient', 'purple', 'modern', 'tech'],
    },
    {
      url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&h=480&fit=crop',
      alt: 'Marble texture with gold',
      tags: ['luxury', 'elegant', 'texture', 'premium'],
    },
    {
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=480&fit=crop',
      alt: 'Mountain peaks above clouds',
      tags: ['nature', 'dramatic', 'inspirational', 'travel'],
    },
    {
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=480&fit=crop',
      alt: 'Earth from space with city lights',
      tags: ['space', 'tech', 'global', 'dark'],
    },
    {
      url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=480&fit=crop',
      alt: 'Starry mountain night sky',
      tags: ['night', 'stars', 'dark', 'dramatic'],
    },
    {
      url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=480&fit=crop',
      alt: 'Retro neon arcade aesthetic',
      tags: ['retro', 'neon', 'gaming', 'fun'],
    },
  ],
};

const TECH_PRODUCT: ImageCategory = {
  name: 'Tech & Product',
  description: 'Product screenshots, dashboards, and tech imagery',
  images: [
    {
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=560&h=320&fit=crop',
      alt: 'Analytics dashboard on screen',
      tags: ['dashboard', 'analytics', 'saas', 'product'],
    },
    {
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=560&h=320&fit=crop',
      alt: 'Data visualization charts',
      tags: ['data', 'charts', 'analytics', 'business'],
    },
    {
      url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=560&h=320&fit=crop',
      alt: 'Developer coding on laptop',
      tags: ['coding', 'developer', 'tech', 'workspace'],
    },
    {
      url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=560&h=320&fit=crop',
      alt: 'Code on dark screen',
      tags: ['code', 'programming', 'dark', 'developer'],
    },
    {
      url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=560&h=320&fit=crop',
      alt: 'Team collaborating at desk',
      tags: ['team', 'collaboration', 'workspace', 'startup'],
    },
    {
      url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=560&h=320&fit=crop',
      alt: 'UI design wireframes',
      tags: ['design', 'ui', 'wireframe', 'creative'],
    },
    {
      url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=560&h=320&fit=crop',
      alt: 'Team working on laptops',
      tags: ['team', 'laptops', 'workspace', 'modern'],
    },
    {
      url: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=560&h=320&fit=crop',
      alt: 'Mobile app on phone screen',
      tags: ['mobile', 'app', 'phone', 'product'],
    },
  ],
};

const LIFESTYLE: ImageCategory = {
  name: 'Lifestyle & People',
  description: 'People, lifestyle, and context imagery for relatable content',
  images: [
    {
      url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=560&h=320&fit=crop',
      alt: 'Diverse team laughing together',
      tags: ['team', 'happy', 'diverse', 'collaboration'],
    },
    {
      url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=560&h=320&fit=crop',
      alt: 'Person working from home',
      tags: ['remote', 'home', 'work', 'lifestyle'],
    },
    {
      url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=560&h=320&fit=crop',
      alt: 'Business meeting in modern office',
      tags: ['meeting', 'business', 'office', 'professional'],
    },
    {
      url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=560&h=320&fit=crop',
      alt: 'Creative brainstorming session',
      tags: ['creative', 'brainstorm', 'team', 'startup'],
    },
    {
      url: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?w=560&h=320&fit=crop',
      alt: 'Person enjoying coffee with laptop',
      tags: ['coffee', 'casual', 'lifestyle', 'morning'],
    },
    {
      url: 'https://images.unsplash.com/photo-1552581234-26160f608093?w=560&h=320&fit=crop',
      alt: 'Hands writing in notebook',
      tags: ['writing', 'planning', 'creative', 'analog'],
    },
  ],
};

const ECOMMERCE: ImageCategory = {
  name: 'E-commerce & Product',
  description: 'Product photography for promotional and transactional emails',
  images: [
    {
      url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=560&h=320&fit=crop',
      alt: 'Minimal product display',
      tags: ['product', 'minimal', 'store', 'retail'],
    },
    {
      url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=560&h=320&fit=crop',
      alt: 'Shopping bags on display',
      tags: ['shopping', 'retail', 'sale', 'bags'],
    },
    {
      url: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=560&h=320&fit=crop',
      alt: 'Online shopping on phone',
      tags: ['ecommerce', 'mobile', 'shopping', 'phone'],
    },
    {
      url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=560&h=320&fit=crop',
      alt: 'Credit card payment',
      tags: ['payment', 'checkout', 'card', 'transaction'],
    },
    {
      url: 'https://images.unsplash.com/photo-1586880244406-556ebe35f282?w=560&h=320&fit=crop',
      alt: 'Package delivery at door',
      tags: ['delivery', 'shipping', 'package', 'order'],
    },
    {
      url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=560&h=320&fit=crop',
      alt: 'Premium product packaging',
      tags: ['packaging', 'premium', 'unboxing', 'luxury'],
    },
  ],
};

const ABSTRACT_PATTERNS: ImageCategory = {
  name: 'Abstract & Patterns',
  description: 'Decorative backgrounds, textures, and visual breakers',
  images: [
    {
      url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=600&h=200&fit=crop',
      alt: 'Watercolor abstract',
      tags: ['abstract', 'watercolor', 'art', 'creative'],
    },
    {
      url: 'https://images.unsplash.com/photo-1604076913837-52ab5f43bc03?w=600&h=200&fit=crop',
      alt: 'Geometric 3D shapes',
      tags: ['geometric', '3d', 'modern', 'abstract'],
    },
    {
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=200&fit=crop',
      alt: 'Flowing fabric waves',
      tags: ['waves', 'fabric', 'elegant', 'flowing'],
    },
    {
      url: 'https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=600&h=200&fit=crop',
      alt: '3D glass morphism shapes',
      tags: ['3d', 'glass', 'modern', 'futuristic'],
    },
    {
      url: 'https://images.unsplash.com/photo-1614851099175-e5b30eb6f696?w=600&h=200&fit=crop',
      alt: 'Liquid metal abstract',
      tags: ['liquid', 'metal', 'futuristic', 'abstract'],
    },
    {
      url: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=600&h=200&fit=crop',
      alt: 'Colorful smoke wisps',
      tags: ['smoke', 'colorful', 'dreamy', 'abstract'],
    },
  ],
};

const ICONS_ILLUSTRATIONS: ImageCategory = {
  name: 'Icons & Illustrations',
  description: 'Small decorative images for feature sections (80x80)',
  images: [
    {
      url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=80&h=80&fit=crop',
      alt: 'React logo style',
      tags: ['tech', 'logo', 'development'],
    },
    {
      url: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=80&h=80&fit=crop',
      alt: 'Abstract colorful shape',
      tags: ['abstract', 'colorful', 'icon'],
    },
    {
      url: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=80&h=80&fit=crop',
      alt: 'Glowing neon circle',
      tags: ['neon', 'glow', 'dark', 'icon'],
    },
    {
      url: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=80&h=80&fit=crop',
      alt: '3D floating sphere',
      tags: ['3d', 'sphere', 'abstract', 'modern'],
    },
    {
      url: 'https://images.unsplash.com/photo-1633412802994-5c058f151b66?w=80&h=80&fit=crop',
      alt: 'Gradient glass cube',
      tags: ['3d', 'glass', 'gradient', 'modern'],
    },
  ],
};

export const IMAGE_LIBRARY: ImageCategory[] = [
  HERO_BACKGROUNDS,
  TECH_PRODUCT,
  LIFESTYLE,
  ECOMMERCE,
  ABSTRACT_PATTERNS,
  ICONS_ILLUSTRATIONS,
];

/** Max images per category in the compact prompt to control token usage */
const MAX_PER_CATEGORY = 3;

/**
 * Build a compact image library prompt for the AI.
 * Uses single-line format and limits images per category to save tokens.
 */
export function buildImageLibraryPrompt(): string {
  let prompt = `## IMAGE LIBRARY — Use real Unsplash images, NOT placehold.co

Pick images matching the email's context/mood. Use placehold.co ONLY for brand logos.

`;

  for (const category of IMAGE_LIBRARY) {
    prompt += `**${category.name}** (${category.description}):\n`;
    const selected = category.images.slice(0, MAX_PER_CATEGORY);
    for (const img of selected) {
      prompt += `${img.url} — ${img.alt} [${img.tags.join(', ')}]\n`;
    }
    prompt += '\n';
  }

  prompt += `**Rules**: Use 3+ different images per email. Hero bg from Hero/Abstract. Icons from Icons category (80x80) — NEVER use emoji as icons. Match context: fintech→dashboards, lifestyle→people, dev→code.`;

  return prompt;
}
