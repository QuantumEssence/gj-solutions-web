const About = () => {
  return (
    <div className="about-container fade-in" style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '4rem' }}>
      {/* Page Header (Screenshot 10_07_21 PM) */}
      <div className="section-header text-center mb-4" style={{ paddingTop: '1.5rem' }}>
        <h1 
          className="section-title" 
          style={{ 
            color: '#2A7B7E', 
            fontSize: '2.5rem', 
            fontWeight: 700, 
            marginBottom: '0.75rem' 
          }}
        >
          About G&J Solutions
        </h1>
        <p 
          className="section-subtitle" 
          style={{ 
            maxWidth: '680px', 
            margin: '0 auto 3.5rem auto', 
            fontSize: '1.05rem', 
            lineHeight: '1.6', 
            color: '#4a5568' 
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      {/* Two-Column Section (Screenshot 10_07_21 PM) */}
      <div 
        className="grid about-grid" 
        style={{ 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '3.5rem',
          alignItems: 'center'
        }}
      >
        {/* Left Column: Our Mission */}
        <div>
          <h2 
            style={{ 
              color: '#2A7B7E', 
              fontSize: '1.75rem', 
              fontWeight: 700, 
              marginBottom: '1.25rem' 
            }}
          >
            Our Mission
          </h2>
          <p style={{ color: '#4a5568', fontSize: '1rem', lineHeight: '1.7', marginBottom: '1.25rem' }}>
            At G&J Solutions, we are dedicated to supporting independent physiotherapists. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p style={{ color: '#4a5568', fontSize: '1rem', lineHeight: '1.7', margin: 0 }}>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>

        {/* Right Column: Large Dashed Wireframe Box */}
        <div 
          style={{ 
            border: '1.5px dashed #2A7B7E', 
            borderRadius: '12px', 
            backgroundColor: '#ffffff', 
            padding: '4.5rem 2rem', 
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
          }}
        >
          <h3 
            style={{ 
              color: '#2A7B7E', 
              fontSize: '1.2rem', 
              fontWeight: 700, 
              marginBottom: '0.75rem' 
            }}
          >
            [ Insert Professional Headshot(s) Here ]
          </h3>
          <p 
            style={{ 
              color: '#64748b', 
              fontSize: '0.925rem', 
              lineHeight: '1.5', 
              maxWidth: '360px', 
              margin: '0 auto' 
            }}
          >
            A warm, approachable photo of the partners works best to build instant rapport with potential clients.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
