export interface FAQItem {
  id?: string | number;
  q?: string;
  a?: string;
  question?: string;
  answer?: string;
}

export interface TestimonialItem {
  id?: string | number;
  quote: string;
  name?: string;
  role: string;
  author?: string;
  clinic?: string;
}

export interface SiteContent {
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  mission_title: string;
  mission_body_1: string;
  mission_body_2: string;
  faqs: FAQItem[];
  testimonials: TestimonialItem[];
}
