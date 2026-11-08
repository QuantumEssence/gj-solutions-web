import React from 'react';
import { Link } from 'react-router-dom';
import type { 
  PageBlock, 
  HeroBlockData, 
  ValuePropsBlockData, 
  SoftwareStripBlockData, 
  TestimonialsBlockData, 
  FAQBlockData, 
  FreeResourceBlockData 
} from '../../sanity/types';

export const HeroBlock: React.FC<{ data: HeroBlockData }> = ({ data }) => {
  return (
    <section className="hero-section-clean">
      <h1 className="hero-title-clean">{data.title}</h1>
      {data.subtitle && (
        <p className="hero-subtitle-clean">
          {data.subtitle}
        </p>
      )}
      {data.description && (
        <p className="hero-desc-clean">
          {data.description}
        </p>
      )}
      <div className="hero-actions-clean">
        <Link to={data.primaryCtaLink || '/contact'} className="btn-solid-teal">
          {data.primaryCtaText || 'Book a Discovery Call'}
        </Link>
        <Link to={data.secondaryCtaLink || '/services'} className="btn-outline-teal">
          {data.secondaryCtaText || 'View Our Services'}
        </Link>
      </div>
    </section>
  );
};

export const ValuePropsBlock: React.FC<{ data: ValuePropsBlockData }> = ({ data }) => {
  return (
    <section style={{ marginBottom: '4rem' }}>
      {data.sectionTitle && (
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#134E48', fontSize: '1.875rem', fontWeight: 700 }}>
          {data.sectionTitle}
        </h2>
      )}
      <div 
        className="grid" 
        style={{ 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1.75rem' 
        }}
      >
        {data.cards.map((card, idx) => (
          <div key={card._key || idx} className="value-card-box">
            <h3 className="value-card-title">{card.title}</h3>
            <p className="value-card-desc">{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export const SoftwareStripBlock: React.FC<{ data: SoftwareStripBlockData }> = ({ data }) => {
  return (
    <section className="software-proficiency-card">
      <h2 className="software-card-title">{data.title}</h2>
      {data.subtitle && <p className="software-card-subtitle">{data.subtitle}</p>}
      <div className="software-btn-group">
        {data.tools.map((tool, idx) => (
          <button key={tool._key || idx} type="button" className="software-btn">
            {tool.name}
          </button>
        ))}
      </div>
    </section>
  );
};

export const TestimonialsBlock: React.FC<{ data: TestimonialsBlockData }> = ({ data }) => {
  return (
    <section className="testimonial-section-container">
      <h2 className="testimonial-main-heading">{data.title}</h2>
      <div className="testimonial-dashed-box">
        <h3 className="testimonial-box-title">[ Testimonial Carousel Placeholder ]</h3>
        {data.subtitle && (
          <p className="testimonial-box-sub">
            {data.subtitle}
          </p>
        )}
        <div className="testimonial-cards-row">
          {data.testimonials.map((t, idx) => (
            <div key={t._key || idx} className="testimonial-white-card">
              {t.quote}
              {t.author && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#0F766E' }}>
                  — {t.author}{t.clinic ? `, ${t.clinic}` : ''}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const FAQBlock: React.FC<{ data: FAQBlockData }> = ({ data }) => {
  return (
    <section className="faq-section-container">
      <h2 className="faq-main-heading">{data.title}</h2>
      <div className="faq-cards-stack">
        {data.faqs.map((faq, idx) => (
          <div key={faq._key || idx} className="faq-white-card">
            <h4 className="faq-q-title">{faq.question}</h4>
            <p className="faq-a-body">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export const FreeResourceBlock: React.FC<{ data: FreeResourceBlockData }> = ({ data }) => {
  return (
    <section className="free-resource-container">
      <h2 className="free-resource-title">{data.title}</h2>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 className="free-resource-placeholder">{data.leadMagnetTitle}</h3>
        <p className="free-resource-desc">{data.description}</p>
      </div>
      <button 
        type="button" 
        className="free-resource-btn"
        onClick={() => window.location.href = data.buttonLink || '/contact'}
      >
        {data.buttonText}
      </button>
    </section>
  );
};

export const BlockRenderer: React.FC<{ blocks: PageBlock[] }> = ({ blocks }) => {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  return (
    <>
      {blocks.map((block, index) => {
        const key = block._key || `${block._type}-${index}`;
        switch (block._type) {
          case 'heroBlock':
            return <HeroBlock key={key} data={block} />;
          case 'valuePropsBlock':
            return <ValuePropsBlock key={key} data={block} />;
          case 'softwareStripBlock':
            return <SoftwareStripBlock key={key} data={block} />;
          case 'testimonialsBlock':
            return <TestimonialsBlock key={key} data={block} />;
          case 'faqBlock':
            return <FAQBlock key={key} data={block} />;
          case 'freeResourceBlock':
            return <FreeResourceBlock key={key} data={block} />;
          default:
            return null;
        }
      })}
    </>
  );
};
