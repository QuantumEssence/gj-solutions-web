import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Home, User, Briefcase, Mail, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar = ({ isCollapsed = false, onToggleCollapse }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Close mobile drawer when resizing above mobile breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'About', path: '/about', icon: <User size={20} /> },
    { name: 'Services', path: '/services', icon: <Briefcase size={20} /> },
    { name: 'Contact', path: '/contact', icon: <Mail size={20} /> },
  ];

  return (
    <>
      <button 
        className="mobile-toggle" 
        onClick={toggleSidebar}
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          {!isCollapsed ? (
            <div className="sidebar-brand-container">
              <Link to="/" className="sidebar-dashed-brand-box" onClick={() => setIsOpen(false)}>
                <div className="dashed-brand-title">G&J Solutions</div>
                <div className="dashed-brand-subtitle">[ Insert Logo Here ]</div>
              </Link>
              {onToggleCollapse && (
                <button 
                  className="collapse-toggle-btn" 
                  onClick={onToggleCollapse}
                  title="Shrink sidebar"
                  aria-label="Shrink sidebar"
                >
                  <ChevronLeft size={16} />
                </button>
              )}
            </div>
          ) : (
            <div className="sidebar-brand-container collapsed">
              <Link to="/" className="sidebar-dashed-brand-box collapsed" onClick={() => setIsOpen(false)} title="G&J Solutions">
                <span className="dashed-brand-title">G&J</span>
              </Link>
              {onToggleCollapse && (
                <button 
                  className="collapse-toggle-btn" 
                  onClick={onToggleCollapse}
                  title="Expand sidebar"
                  aria-label="Expand sidebar"
                >
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          <ul>
            {navLinks.map((link) => (
              <li key={link.name}>
                <NavLink 
                  to={link.path} 
                  title={link.name}
                  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="nav-icon">{link.icon}</span>
                  <span className="nav-text">{link.name}</span>
                </NavLink>
              </li>
            ))}
            <li className="admin-link-wrapper">
              <NavLink 
                to="/admin" 
                title="Admin Portal (PoC)"
                className={({ isActive }) => isActive ? 'nav-link active admin-link' : 'nav-link admin-link'}
                onClick={() => setIsOpen(false)}
              >
                <span className="nav-icon"><Lock size={20} /></span>
                <span className="nav-text admin-text">Admin Portal (PoC)</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        {!isCollapsed && (
          <div className="sidebar-footer">
            <div className="sidebar-legal-links mb-2">
              <Link to="/privacy-policy" onClick={() => setIsOpen(false)}>Privacy Policy</Link>
              <span className="legal-divider">|</span>
              <Link to="/terms-of-service" onClick={() => setIsOpen(false)}>Terms of Service</Link>
            </div>
            <p className="copyright-text">© 2026 G&J Solutions</p>
          </div>
        )}
      </aside>
      
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </>
  );
};

export default Sidebar;
