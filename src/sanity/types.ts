export interface HeroBlockData {
  _type: 'heroBlock';
  _key?: string;
  badge?: string;
  title: string;
  subtitle?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

export interface ValuePropositionItem {
  _key?: string;
  title: string;
  description: string;
  iconName?: string;
}

export interface ValuePropsBlockData {
  _type: 'valuePropsBlock';
  _key?: string;
  sectionTitle?: string;
  cards: ValuePropositionItem[];
}

export interface SoftwareBadge {
  _key?: string;
  name: string;
  category?: string;
}

export interface SoftwareStripBlockData {
  _type: 'softwareStripBlock';
  _key?: string;
  title: string;
  subtitle?: string;
  tools: SoftwareBadge[];
}

export interface TestimonialItemData {
  _key?: string;
  quote: string;
  author: string;
  role?: string;
  clinic?: string;
}

export interface TestimonialsBlockData {
  _type: 'testimonialsBlock';
  _key?: string;
  title: string;
  subtitle?: string;
  testimonials: TestimonialItemData[];
}

export interface FAQItemData {
  _key?: string;
  question: string;
  answer: string;
}

export interface FAQBlockData {
  _type: 'faqBlock';
  _key?: string;
  title: string;
  subtitle?: string;
  faqs: FAQItemData[];
}

export interface FreeResourceBlockData {
  _type: 'freeResourceBlock';
  _key?: string;
  title: string;
  leadMagnetTitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export type PageBlock = 
  | HeroBlockData 
  | ValuePropsBlockData 
  | SoftwareStripBlockData 
  | TestimonialsBlockData 
  | FAQBlockData 
  | FreeResourceBlockData;

export interface SanityPageData {
  _id?: string;
  title: string;
  slug?: { current: string };
  pageBuilder: PageBlock[];
}
