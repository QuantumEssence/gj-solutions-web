import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { CommandMenu } from './components/CommandMenu';
import { trackPageView } from './features/analytics';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

import StudioPage from './pages/StudioPage';

const PageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView({ path: location.pathname });
  }, [location.pathname]);

  return null;
};

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Router>
      <PageTracker />
      <CommandMenu />
      <div 
        className={`app-container ${isCollapsed ? 'sidebar-collapsed' : ''}`}
        style={{
          transitionTimingFunction: 'var(--ease-sheet)',
          transitionDuration: 'var(--duration-sheet)',
        }}
      >
        <Sidebar 
          isCollapsed={isCollapsed} 
          onToggleCollapse={() => setIsCollapsed((prev) => !prev)} 
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/studio/*" element={<StudioPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
