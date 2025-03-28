import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import Achievements from '../components/Achievements';
import Certifications from '../components/Certifications';
import Contact from '../components/Contact';
import FloatingIcons from '../components/FloatingIcons';
import { debug } from '../utils/debug';
import { useEffect } from 'react';

const Index = () => {
  useEffect(() => {
    debug.log('Index page mounted');
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-background to-secondary/30 dark:from-background dark:to-secondary/10">
      <FloatingIcons />
      <main className="relative">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Achievements />
        <Certifications />
        <Contact />
      </main>
    </div>
  );
};

export default Index;
