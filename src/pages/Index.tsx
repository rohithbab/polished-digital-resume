
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import Achievements from '../components/Achievements';
import Contact from '../components/Contact';
import FloatingIcons from '../components/FloatingIcons';

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <FloatingIcons />
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Achievements />
      <Contact />
    </div>
  );
};

export default Index;
