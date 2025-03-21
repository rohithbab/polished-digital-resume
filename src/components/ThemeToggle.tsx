
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // On mount, check for system preference or stored preference
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <button 
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="p-2 rounded-full bg-secondary dark:bg-secondary/50 hover:bg-secondary/80 dark:hover:bg-secondary/70 transition-colors duration-200"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-foreground/80" />
      ) : (
        <Sun className="w-5 h-5 text-foreground/80" />
      )}
    </button>
  );
};

export default ThemeToggle;
