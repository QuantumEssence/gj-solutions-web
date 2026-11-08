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
  out_of_scope_title?: string;
  out_of_scope_description?: string;
  out_of_scope_items?: string[];
  faqs: FAQItem[];
  testimonials: TestimonialItem[];
}

export const DEFAULT_CONTENT: SiteContent = {
  hero_title: 'Dedicated Practice Support & Virtual Assistants for Australian Physiotherapists',
  hero_subtitle: 'Cliniko & Nookal Diary Optimization • Patient Intake Triage • Frontdesk Operations',
  hero_description: 'We partner with independent physiotherapy and allied health clinics across Australia to streamline administrative operations. From patient scheduling and intake triage to diary optimization in Cliniko and Nookal, our team ensures your clinicians focus entirely on delivering exceptional patient care.',
  mission_title: 'Our Mission',
  mission_body_1: 'At G&J Solutions, we are dedicated to supporting independent physiotherapists. We relieve healthcare practitioners from administrative burdens so they can focus on patient care and clinical excellence.',
  mission_body_2: 'Operating in strict adherence with Australian Privacy Principles (APPs) and our practice support protocols, our team provides secure, reliable practice coordination directly inside your Practice Management Software (Cliniko, Nookal, Coreplus) without handling confidential patient medical records.',
  out_of_scope_title: 'Out of Scope Services',
  out_of_scope_description: 'To ensure we provide the highest quality service in our areas of expertise, we explicitly do not handle:',
  out_of_scope_items: [
    'Accounting and tax filing',
    'Accessing clients\' bank details',
    'Tracking receipts of payments from clients'
  ],
  faqs: [
    {
      q: 'Do you handle direct patient health records (PHI)?',
      a: 'No. G&J Solutions operates in strict adherence with Australian Privacy Principles (APPs) and our Memorandum of Agreement (MOA). We never collect, store, or process confidential patient diagnoses, prescriptions, or clinical medical records.'
    },
    {
      q: 'How does diary management integrate with our practice software?',
      a: 'We integrate securely with your existing practice management software, including Cliniko, Nookal, and Coreplus. Our assistants manage appointment bookings, practitioner calendars, recall lists, and short-notice cancellation fills following your clinic customized protocols.'
    },
    {
      q: 'What is the onboarding timeline for a new clinic?',
      a: 'Following our initial consultation and software access configuration, our dedicated support team can be actively coordinating your calendar and patient communications within 48 to 72 business hours.'
    }
  ],
  testimonials: [
    {
      quote: 'G&J Solutions streamlined our practitioner desk work and report formatting, saving our clinic over 15 hours each week.',
      name: 'Dr. Sarah Jenkins',
      role: 'Principal Physiotherapist • Example Clinic'
    },
    {
      quote: 'Their compliance with Australian privacy standards and rapid turnaround gives our practice total peace of mind.',
      name: 'Mark Thompson',
      role: 'Clinic Director • PhysioWorks AU'
    },
    {
      quote: 'G&J Solutions helped me reclaim 10 hours a week! My patients love how quickly their emails are answered now.',
      name: 'Emma Davis',
      role: 'Director • Mindful Psychology'
    }
  ]
};

/**
 * Resiliently fetches dynamic site content from GET /api/content.
 * If network fails or payload is malformed, seamlessly returns DEFAULT_CONTENT.
 */
export async function fetchSiteContent(): Promise<SiteContent> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch('/api/content', {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return DEFAULT_CONTENT;
    }

    const data = await response.json();
    const content = data?.content;

    if (!content || typeof content !== 'object') {
      return DEFAULT_CONTENT;
    }

    return {
      hero_title: content.hero_title || DEFAULT_CONTENT.hero_title,
      hero_subtitle: content.hero_subtitle || DEFAULT_CONTENT.hero_subtitle,
      hero_description: content.hero_description || DEFAULT_CONTENT.hero_description,
      mission_title: content.mission_title || DEFAULT_CONTENT.mission_title,
      mission_body_1: content.mission_body_1 || DEFAULT_CONTENT.mission_body_1,
      mission_body_2: content.mission_body_2 || DEFAULT_CONTENT.mission_body_2,
      out_of_scope_title: content.out_of_scope_title || DEFAULT_CONTENT.out_of_scope_title,
      out_of_scope_description: content.out_of_scope_description || DEFAULT_CONTENT.out_of_scope_description,
      out_of_scope_items: Array.isArray(content.out_of_scope_items) && content.out_of_scope_items.length > 0
        ? content.out_of_scope_items
        : DEFAULT_CONTENT.out_of_scope_items,
      faqs: Array.isArray(content.faqs) && content.faqs.length > 0 ? content.faqs : DEFAULT_CONTENT.faqs,
      testimonials: Array.isArray(content.testimonials) && content.testimonials.length > 0 ? content.testimonials : DEFAULT_CONTENT.testimonials
    };
  } catch {
    // Offline resilience: return default content on any error without throwing
    return DEFAULT_CONTENT;
  }
}
