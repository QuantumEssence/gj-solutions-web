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

export const DEFAULT_CONTENT: SiteContent = {
  hero_title: 'Virtual Practice Assistants for Australian Physiotherapists',
  hero_subtitle: 'Dedicated Practice Support • Cliniko & Nookal Diary Optimization • Patient Intake Triage',
  hero_description: 'We partner with independent physiotherapy and allied health clinics across Australia to streamline administrative operations. From patient scheduling and intake triage to diary optimization, our team ensures your clinicians focus entirely on delivering exceptional patient care.',
  mission_title: 'Our Purpose: Restoring Focus to Clinical Care',
  mission_body_1: 'At G&J Solutions, we believe allied health practitioners should spend their energy where it matters most: delivering clinical care and guiding patients through recovery — not burning out on appointment juggling, phone tags, and administrative backlogs.',
  mission_body_2: 'We bridge frontdesk capacity gaps for physiotherapy practices across Melbourne, Sydney, Brisbane, Perth, Adelaide, and regional Australia. By operating directly inside your Practice Management Software (PMS), we function as an organic extension of your reception team, upholding strict Australian confidentiality standards and clinical governance.',
  faqs: [
    {
      q: 'How does diary management integrate with our practice software?',
      a: 'We integrate securely with your existing practice management software, including Cliniko, Nookal, and Coreplus. Our assistants manage appointment bookings, practitioner calendars, recall lists, and short-notice cancellation fills following your clinic customized protocols.'
    },
    {
      q: 'How is patient confidentiality maintained?',
      a: 'Our administrative workflows adhere strictly to the Australian Privacy Principles (APPs). We handle only non-clinical operational tasks such as scheduling and intake distribution directly within your PMS. We never store patient health information on local devices, nor do we provide clinical advice or alter clinical treatment notes.'
    },
    {
      q: 'What is the onboarding timeline for a new clinic?',
      a: 'Following our initial consultation and software access configuration, our dedicated support team can be actively coordinating your calendar and patient communications within 48 to 72 business hours.'
    }
  ],
  testimonials: [
    {
      quote: 'Partnering with G&J Solutions restored order to our daily clinic schedule. Diary gaps decreased noticeably within our first quarter because cancellations were triaged and filled proactively.',
      name: 'Dr. Lachlan Murphy, B.Physio',
      role: 'Clinical Director • Melbourne Sports Physiotherapy'
    },
    {
      quote: 'Our reception was burdened with intake management and GP documentation. Having reliable, privacy-conscious administrative support handling our communications has given our practitioners their evenings back.',
      name: 'Sarah Jennings, APAM',
      role: 'Principal Physiotherapist • Brisbane Rehabilitation Care'
    },
    {
      quote: 'As a private practitioner managing high caseloads, handling administrative calls between consults was unsustainable. G&J Solutions stepped in smoothly and established consistent practice operations.',
      name: 'Mark Henderson',
      role: 'Director • Sydney Coastal Movement & Physiotherapy'
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
      faqs: Array.isArray(content.faqs) && content.faqs.length > 0 ? content.faqs : DEFAULT_CONTENT.faqs,
      testimonials: Array.isArray(content.testimonials) && content.testimonials.length > 0 ? content.testimonials : DEFAULT_CONTENT.testimonials
    };
  } catch {
    // Offline resilience: return default content on any error without throwing
    return DEFAULT_CONTENT;
  }
}
