import { Calendar, BarChart3, FileText } from 'lucide-react';

const Services = () => {
  const featureCards = [
    {
      id: 1,
      icon: <Calendar size={28} style={{ color: '#2A7B7E' }} />,
      title: 'Frontdesk Work',
      description: 'Emails, scheduling, and calls. Managing your inbox and professional calendar alongside personal commitments for a stress-free schedule.'
    },
    {
      id: 2,
      icon: <BarChart3 size={28} style={{ color: '#2A7B7E' }} />,
      title: 'Report Preparation & Data Gathering',
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.'
    },
    {
      id: 3,
      icon: <FileText size={28} style={{ color: '#2A7B7E' }} />,
      title: 'Contract Review (Plain-Language Risk Read)',
      description: 'A second pair of eyes to highlight ambiguous clauses and risks. I am not a lawyer and this is not legal advice, but a risk read I can stand behind.'
    }
  ];

  return (
    <div className="services-container fade-in" style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '4rem' }}>
      {/* Page Header */}
      <div className="section-header text-center mb-4">
        <h1 
          className="section-title" 
          style={{ 
            color: '#2A7B7E', 
            fontSize: '2.5rem', 
            fontWeight: 700, 
            marginBottom: '0.75rem' 
          }}
        >
          Our Services
        </h1>
        <p 
          className="section-subtitle" 
          style={{ 
            maxWidth: '680px', 
            margin: '0 auto 3rem auto', 
            fontSize: '1.05rem', 
            lineHeight: '1.6', 
            color: '#4a5568' 
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      {/* 3 Feature Cards Grid */}
      <div 
        className="grid services-features-grid mb-4" 
        style={{ 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1.75rem' 
        }}
      >
        {featureCards.map(card => (
          <div 
            key={card.id} 
            className="card" 
            style={{ 
              padding: '2.25rem 1.75rem', 
              borderRadius: '12px', 
              border: '1px solid #e2e8f0', 
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ marginBottom: '1rem' }}>
              {card.icon}
            </div>
            <h3 
              style={{ 
                color: '#2A7B7E', 
                fontSize: '1.25rem', 
                fontWeight: 700, 
                marginBottom: '0.75rem' 
              }}
            >
              {card.title}
            </h3>
            <p 
              style={{ 
                color: '#4a5568', 
                fontSize: '0.95rem', 
                lineHeight: '1.65', 
                margin: 0 
              }}
            >
              {card.description}
            </p>
          </div>
        ))}
      </div>

      {/* Service Packages (PoC Placeholder) */}
      <div style={{ marginTop: '4.5rem', marginBottom: '3.5rem' }}>
        <h2 
          style={{ 
            color: '#2A7B7E', 
            fontSize: '1.85rem', 
            fontWeight: 700, 
            textAlign: 'center', 
            marginBottom: '2rem' 
          }}
        >
          Service Packages (PoC Placeholder)
        </h2>

        <div 
          className="grid packages-grid" 
          style={{ 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '1.75rem' 
          }}
        >
          {/* Package 1 */}
          <div 
            style={{ 
              border: '1.5px dashed #2A7B7E', 
              borderRadius: '10px', 
              padding: '2.5rem 1.75rem', 
              textAlign: 'center', 
              backgroundColor: '#ffffff' 
            }}
          >
            <h3 
              style={{ 
                color: '#2A7B7E', 
                fontSize: '1.15rem', 
                fontWeight: 700, 
                marginBottom: '0.5rem' 
              }}
            >
              [ Frontdesk Work Tier ]
            </h3>
            <p 
              style={{ 
                color: '#64748b', 
                fontSize: '0.925rem', 
                margin: 0, 
                lineHeight: '1.5' 
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>

          {/* Package 2 */}
          <div 
            style={{ 
              border: '1.5px dashed #2A7B7E', 
              borderRadius: '10px', 
              padding: '2.5rem 1.75rem', 
              textAlign: 'center', 
              backgroundColor: '#ffffff' 
            }}
          >
            <h3 
              style={{ 
                color: '#2A7B7E', 
                fontSize: '1.15rem', 
                fontWeight: 700, 
                marginBottom: '0.5rem' 
              }}
            >
              [ Report Prep & Data Gathering Tier ]
            </h3>
            <p 
              style={{ 
                color: '#64748b', 
                fontSize: '0.925rem', 
                margin: 0, 
                lineHeight: '1.5' 
              }}
            >
              Duis aute irure dolor in reprehenderit in voluptate velit esse.
            </p>
          </div>
        </div>
      </div>

      {/* Out of Scope Services Card */}
      <section 
        style={{ 
          marginTop: '3.5rem', 
          backgroundColor: '#FFF5F5', 
          border: '1px solid #FED7D7', 
          borderRadius: '12px', 
          padding: '3rem 2rem', 
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
        }}
      >
        <h2 
          style={{ 
            color: '#C53030', 
            fontSize: '1.85rem', 
            fontWeight: 700, 
            marginBottom: '0.75rem' 
          }}
        >
          Out of Scope Services
        </h2>
        
        <p 
          style={{ 
            color: '#9B2C2C', 
            fontSize: '0.975rem', 
            lineHeight: '1.6', 
            maxWidth: '680px', 
            margin: '0 auto 1.5rem auto' 
          }}
        >
          To ensure we provide the highest quality service in our areas of expertise, we explicitly <strong>do not handle</strong>:
        </p>

        <div style={{ display: 'inline-block', textAlign: 'left', margin: '0 auto' }}>
          <ul 
            style={{ 
              listStyleType: 'disc', 
              paddingLeft: '1.5rem', 
              color: '#9B2C2C', 
              fontSize: '0.95rem', 
              lineHeight: '2.1' 
            }}
          >
            <li>Accounting and tax filing</li>
            <li>Accessing clients' bank details</li>
            <li>Tracking receipts of payments from clients</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Services;
