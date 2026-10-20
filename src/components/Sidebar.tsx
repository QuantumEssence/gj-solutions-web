import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
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
          <div className="logo-placeholder-box">
            <span className="logo-text">{isCollapsed ? 'G&J' : 'G&J Solutions'}</span>
            {!isCollapsed && <span className="logo-hint">Practice Support Specialists</span>}
          </div>
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
            <div className="legal-links-placeholder mb-2">
              <a href="#">Privacy Policy</a>
              <span style={{ margin: '0 0.5rem' }}>|</span>
              <a href="#">Terms of Service</a>
            </div>
            <p>© {new Date().getFullYear()} G&J Solutions</p>
          </div>
        )}
      </aside>
      
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </>
  );
};

export default Sidebar;
