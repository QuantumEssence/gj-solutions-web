import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Home, User, Briefcase, Mail, Lock, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
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
          <Link to="/" className="logo-brand-box" onClick={() => setIsOpen(false)}>
            <div className="logo-icon-badge">
              <Activity size={18} />
            </div>
            <div className="logo-text-group">
              <span className="logo-text">{isCollapsed ? 'G&J' : 'G&J Solutions'}</span>
              {!isCollapsed && <span className="logo-hint">Allied Practice Support</span>}
            </div>
          </Link>
          {onToggleCollapse && (
            <button 
              className="collapse-toggle-btn" 
              onClick={onToggleCollapse}
              title={isCollapsed ? 'Expand sidebar' : 'Shrink sidebar'}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Shrink sidebar'}
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
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
                title="Admin Portal"
                className={({ isActive }) => isActive ? 'nav-link active admin-link' : 'nav-link admin-link'}
                onClick={() => setIsOpen(false)}
              >
                <span className="nav-icon"><Lock size={20} /></span>
                <span className="nav-text admin-text">Admin Portal</span>
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
            <p className="copyright-text">© {new Date().getFullYear()} G&J Solutions (AU)</p>
          </div>
        )}
      </aside>
      
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </>
  );
};

export default Sidebar;
