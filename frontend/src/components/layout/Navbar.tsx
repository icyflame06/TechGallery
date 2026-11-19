import React, { useState, useEffect } from 'react';
import { Shield, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onOpenAdmin: () => void;
  onOpenSubmission?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [scrollPercent, setScrollPercent] = useState(0);
  const { isAdmin } = useAuth();

  useEffect(() => {
    // Detect system preference or stored theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = prefersDark ? 'dark' : 'dark'; // default to dark as per design spec
    document.documentElement.setAttribute('data-theme', initialTheme);
    setIsDark(initialTheme === 'dark');

    // Scroll progress tracker
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollPercent(Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    setIsDark(!isDark);
  };

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Events', href: '#events' },
    { name: 'Showcase', href: '#showcase' },
    { name: 'Schedule', href: '#schedule' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header>
      {/* Scroll-triggered progress indicator */}
      <div className="scroll-progress-bar" style={{ width: `${scrollPercent}%` }} aria-hidden="true" />

      <div className="wrap">
        <nav>
          <a className="logo" href="#top">
            <i aria-hidden="true" />
            <span>Tech Gallery 2027</span>
          </a>

          <button
            className="menu"
            aria-expanded={menuOpen}
            aria-controls="links"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>

          <div className={`links ${menuOpen ? 'open' : ''}`} id="links">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}

            <a
              className="btn fill"
              href="#register"
              onClick={() => setMenuOpen(false)}
            >
              Register
            </a>

            <button
              onClick={toggleTheme}
              aria-label="Toggle light/dark theme"
              title="Toggle theme"
              style={{
                background: 'none',
                border: '1px solid var(--line)',
                color: 'var(--ink)',
                cursor: 'pointer',
                padding: '0.45rem',
                borderRadius: 'var(--r)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                onOpenAdmin();
              }}
              aria-label="Admin Portal"
              title="Admin Portal"
              style={{
                background: isAdmin ? 'var(--lime)' : 'none',
                border: '1px solid ' + (isAdmin ? 'var(--lime)' : 'var(--line)'),
                color: isAdmin ? 'var(--limeink)' : 'var(--ink)',
                cursor: 'pointer',
                padding: '0.45rem',
                borderRadius: 'var(--r)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Shield size={15} />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};
