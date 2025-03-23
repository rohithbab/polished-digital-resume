import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Achievements', href: '#achievements' },
  { name: 'Contact', href: '#contact' },
];

// Regular page links that don't use hash navigation
const pageLinks = [
  { name: 'Firebase Test', href: '/firebase-test' }
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-nav py-3' : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <a href="#home" className="text-lg md:text-xl font-heading font-bold">
          M E Rohith Babu
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-primary dark:hover:text-accent"
              >
                {link.name}
              </a>
            ))}
            
            {pageLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-medium transition-colors hover:text-primary dark:hover:text-accent"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <ThemeToggle />
        </div>

        {/* Mobile Nav Toggle */}
        <div className="flex items-center md:hidden space-x-4">
          <ThemeToggle />
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md text-foreground"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      <div
        className={`fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out glass-nav md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '60px' }}
      >
        <div className="flex flex-col h-full pt-6 pb-20 px-4 overflow-y-auto">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={closeMenu}
                className="py-3 text-base font-medium border-b border-border hover:text-primary dark:hover:text-accent transition-colors"
              >
                {link.name}
              </a>
            ))}
            
            {pageLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={closeMenu}
                className="py-3 text-base font-medium border-b border-border hover:text-primary dark:hover:text-accent transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
