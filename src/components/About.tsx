
import { useRef } from 'react';
import { 
  BookOpen, GraduationCap, HeartPulse, 
  ChevronLeft, ChevronRight
} from 'lucide-react';

interface AboutCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const AboutCard = ({ title, icon, children }: AboutCardProps) => (
  <div className="about-card card-gradient">
    <div className="flex items-center mb-4">
      <div className="bg-primary/10 dark:bg-accent/10 p-2 rounded-md mr-3">
        {icon}
      </div>
      <h3 className="text-2xl font-bold">{title}</h3>
    </div>
    <div className="min-h-[200px]">
      {children}
    </div>
  </div>
);

const About = () => {
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (cardsContainerRef.current) {
      cardsContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (cardsContainerRef.current) {
      cardsContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section id="about" className="py-20 bg-secondary/30 dark:bg-secondary/10">
      <div className="section-container">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="mb-4">About</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Learn more about my background, education, and personal interests.
          </p>
        </div>

        <div className="relative">
          {/* Arrow Navigation for Mobile & Tablet */}
          <div className="flex justify-between mb-4 md:hidden">
            <button
              onClick={scrollLeft}
              className="p-2 rounded-full bg-secondary/70 hover:bg-secondary/90 dark:bg-secondary/40 dark:hover:bg-secondary/60 transition-colors"
              aria-label="Previous card"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={scrollRight}
              className="p-2 rounded-full bg-secondary/70 hover:bg-secondary/90 dark:bg-secondary/40 dark:hover:bg-secondary/60 transition-colors"
              aria-label="Next card"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Cards Container with Horizontal Scroll on Mobile */}
          <div 
            ref={cardsContainerRef}
            className="flex gap-6 md:gap-8 pb-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none scrollbar-hide md:grid md:grid-cols-3"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* About Me Card */}
            <div className="min-w-[280px] sm:min-w-[320px] md:min-w-0 flex-shrink-0 snap-center animate-fade-in-left" style={{ animationDelay: '0.1s' }}>
              <AboutCard title="About Me" icon={<BookOpen className="h-6 w-6" />}>
                <div>
                  <p className="mb-4">
                    I'm a passionate Data Analyst with expertise in transforming complex datasets into actionable insights. 
                    With a strong foundation in statistical analysis and data visualization, I help organizations make data-driven decisions.
                  </p>
                  <p>
                    My approach combines technical expertise with business acumen to deliver meaningful results that drive growth and efficiency.
                  </p>
                </div>
              </AboutCard>
            </div>

            {/* Education Card */}
            <div className="min-w-[280px] sm:min-w-[320px] md:min-w-0 flex-shrink-0 snap-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <AboutCard title="Education" icon={<GraduationCap className="h-6 w-6" />}>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold">Master of Data Science</h4>
                    <p className="text-muted-foreground">University of Data Analytics, 2019-2021</p>
                  </div>
                  <div>
                    <h4 className="font-bold">Bachelor of Computer Science</h4>
                    <p className="text-muted-foreground">Tech Institute of Computer Science, 2015-2019</p>
                  </div>
                </div>
              </AboutCard>
            </div>

            {/* Hobbies Card */}
            <div className="min-w-[280px] sm:min-w-[320px] md:min-w-0 flex-shrink-0 snap-center animate-fade-in-right" style={{ animationDelay: '0.3s' }}>
              <AboutCard title="Hobbies" icon={<HeartPulse className="h-6 w-6" />}>
                <div className="space-y-3">
                  <p>When I'm not analyzing data, you can find me:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Reading books on emerging technologies</li>
                    <li>Playing chess and strategic board games</li>
                    <li>Hiking and exploring nature trails</li>
                    <li>Contributing to open-source data projects</li>
                  </ul>
                </div>
              </AboutCard>
            </div>
          </div>

          {/* Desktop Navigation Arrows */}
          <div className="hidden md:block">
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 p-3 rounded-full bg-secondary/70 hover:bg-secondary/90 dark:bg-secondary/40 dark:hover:bg-secondary/60 transition-colors shadow-lg"
              aria-label="Previous card"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 p-3 rounded-full bg-secondary/70 hover:bg-secondary/90 dark:bg-secondary/40 dark:hover:bg-secondary/60 transition-colors shadow-lg"
              aria-label="Next card"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
