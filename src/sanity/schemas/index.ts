import { defineType, defineField, defineArrayMember } from 'sanity';

export const heroBlockType = defineType({
  name: 'heroBlock',
  title: 'Hero Section',
  type: 'object',
  fields: [
    defineField({ name: 'badge', title: 'Badge Label', type: 'string' }),
    defineField({ name: 'title', title: 'Main Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'string' }),
    defineField({ name: 'description', title: 'Description Paragraph', type: 'text' }),
    defineField({ name: 'primaryCtaText', title: 'Primary CTA Label', type: 'string' }),
    defineField({ name: 'primaryCtaLink', title: 'Primary CTA Link', type: 'string' }),
    defineField({ name: 'secondaryCtaText', title: 'Secondary CTA Label', type: 'string' }),
    defineField({ name: 'secondaryCtaLink', title: 'Secondary CTA Link', type: 'string' })
  ]
});

export const valuePropsBlockType = defineType({
  name: 'valuePropsBlock',
  title: 'Value Propositions Grid',
  type: 'object',
  fields: [
    defineField({ name: 'sectionTitle', title: 'Section Title', type: 'string' }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Card Title', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'description', title: 'Card Description', type: 'text', validation: (Rule) => Rule.required() })
          ]
        })
      ]
    })
  ]
});

export const softwareStripBlockType = defineType({
  name: 'softwareStripBlock',
  title: 'Software Proficiency Strip',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Section Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'string' }),
    defineField({
      name: 'tools',
      title: 'Software Badges',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Software Name (e.g. MS TEAMS)', type: 'string', validation: (Rule) => Rule.required() })
          ]
        })
      ]
    })
  ]
});

export const testimonialsBlockType = defineType({
  name: 'testimonialsBlock',
  title: 'Testimonials Carousel/Grid',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'string' }),
    defineField({
      name: 'testimonials',
      title: 'Quotes List',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'quote', title: 'Quote Content', type: 'text', validation: (Rule) => Rule.required() }),
            defineField({ name: 'author', title: 'Author Name', type: 'string' }),
            defineField({ name: 'role', title: 'Author Role', type: 'string' }),
            defineField({ name: 'clinic', title: 'Clinic / Practice Name', type: 'string' })
          ]
        })
      ]
    })
  ]
});

export const faqBlockType = defineType({
  name: 'faqBlock',
  title: 'FAQ Accordion Stack',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'faqs',
      title: 'Questions',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'question', title: 'Question', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'answer', title: 'Answer', type: 'text', validation: (Rule) => Rule.required() })
          ]
        })
      ]
    })
  ]
});

export const freeResourceBlockType = defineType({
  name: 'freeResourceBlock',
  title: 'Free Resource Lead Magnet',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Section Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'leadMagnetTitle', title: 'Resource Name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'buttonText', title: 'Button Text', type: 'string' }),
    defineField({ name: 'buttonLink', title: 'Button Link', type: 'string' })
  ]
});

export const pageType = defineType({
  name: 'page',
  title: 'Modular Pages',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Page Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page Builder (Modular Blocks)',
      type: 'array',
      of: [
        defineArrayMember({ type: 'heroBlock' }),
        defineArrayMember({ type: 'valuePropsBlock' }),
        defineArrayMember({ type: 'softwareStripBlock' }),
        defineArrayMember({ type: 'testimonialsBlock' }),
        defineArrayMember({ type: 'faqBlock' }),
        defineArrayMember({ type: 'freeResourceBlock' })
      ]
    })
  ]
});

export const schemaTypes = [
  pageType,
  heroBlockType,
  valuePropsBlockType,
  softwareStripBlockType,
  testimonialsBlockType,
  faqBlockType,
  freeResourceBlockType
];
