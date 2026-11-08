import type { PageBlock } from './types';

export const FALLBACK_HOME_BLOCKS: PageBlock[] = [
  {
    _type: 'heroBlock',
    _key: 'hero-default',
    badge: 'Australian Allied Health Practice Support',
    title: 'G&J Solutions',
    subtitle: 'Dedicated Virtual Assistants for Independent Physiotherapists',
    description: 'We help independent physiotherapy practices streamline their operations. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    primaryCtaText: 'Book a Discovery Call',
    primaryCtaLink: '/contact',
    secondaryCtaText: 'View Our Services',
    secondaryCtaLink: '/services'
  },
  {
    _type: 'valuePropsBlock',
    _key: 'values-default',
    cards: [
      {
        _key: 'vp-1',
        title: 'More Time for Patients',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.'
      },
      {
        _key: 'vp-2',
        title: 'Reduced Administrative Burnout',
        description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.'
      },
      {
        _key: 'vp-3',
        title: 'Seamless Integration',
        description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo.'
      }
    ]
  },
  {
    _type: 'softwareStripBlock',
    _key: 'software-default',
    title: 'Software Proficiency',
    subtitle: 'Experienced with the tools you already use.',
    tools: [
      { _key: 's-1', name: 'MS TEAMS' },
      { _key: 's-2', name: 'JUSTCALL' },
      { _key: 's-3', name: 'OUTLOOK' },
      { _key: 's-4', name: 'MS Office' }
    ]
  },
  {
    _type: 'testimonialsBlock',
    _key: 'testimonials-default',
    title: 'Client Testimonials',
    subtitle: 'This area will display quotes and headshots from your satisfied clinic owner clients.',
    testimonials: [
      {
        _key: 't-1',
        quote: '"G&J Solutions helped me reclaim 10 hours a week!"',
        author: 'Dr. Lachlan Murphy, B.Physio',
        role: 'Clinical Director',
        clinic: 'Melbourne Sports Physiotherapy'
      },
      {
        _key: 't-2',
        quote: '"My patients love how quickly their emails are answered now."',
        author: 'Sarah Jenkins, Practice Principal',
        role: 'Founder',
        clinic: 'Coastal Allied Health'
      }
    ]
  },
  {
    _type: 'faqBlock',
    _key: 'faq-default',
    title: 'Frequently Asked Questions',
    faqs: [
      {
        _key: 'f-1',
        question: 'How to schedule an appointment?',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      },
      {
        _key: 'f-2',
        question: 'How to cancel?',
        answer: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
      },
      {
        _key: 'f-3',
        question: 'How to reschedule?',
        answer: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
      }
    ]
  },
  {
    _type: 'freeResourceBlock',
    _key: 'resource-default',
    title: 'Free Resource',
    leadMagnetTitle: '[ Downloadable Lead Magnet Placeholder ]',
    description: 'Offer a free guide (e.g., "5 Signs Your Clinic Needs a VA") to capture email addresses and build your mailing list.',
    buttonText: '[ Download Guide ]',
    buttonLink: '/contact'
  }
];
