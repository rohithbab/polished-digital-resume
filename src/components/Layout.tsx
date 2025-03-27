import { ReactNode } from 'react';
import Navbar from './Navbar';
import { debug } from '../utils/debug';
import { useEffect } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  useEffect(() => {
    debug.log('Layout mounted');
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      {children}
    </div>
  );
};

export default Layout; 