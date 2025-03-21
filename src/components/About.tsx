
import { useState } from 'react';
import { 
  BookOpen, GraduationCap, HeartPulse, 
  ChevronLeft, ChevronRight
} from 'lucide-react';

interface AboutCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive: boolean;
}

const AboutCard = ({ title, icon, children, isActive }: AboutCardProps) => {
  return (
    <div 
      className={`w-full max-w-md transition-all duration-500 ease-in-out ${
        isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute'
      }`}
    >
      <div className="p-8 bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg">
        <div className="flex items-center mb-6">
          <div className="bg-primary/10 dark:bg-accent/10 p-3 rounded-md mr-4">
            {icon}
          </div>
          <h3 className="text-2xl font-bold">{title}</h3>
        </div>
        <div className="min-h-[230px] text-lg">
          {children}
        </div>
      </div>
    </div>
  );
};

const About = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const cards = [
    {
      title: "About Me",
      icon: <BookOpen className="h-7 w-7" />,
      content: (
        <div>
          <p className="mb-5 text-lg">
            I'm a passionate Data Analyst with expertise in transforming complex datasets into actionable insights. 
            With a strong foundation in statistical analysis and data visualization, I help organizations make data-driven decisions.
          </p>
          <p className="text-lg">
            My approach combines technical expertise with business acumen to deliver meaningful results that drive growth and efficiency.
          </p>
        </div>
      )
    },
    {
      title: "Education",
      icon: <GraduationCap className="h-7 w-7" />,
      content: (
        <div className="space-y-5">
          <div>
            <h4 className="font-bold text-xl">Master of Data Science</h4>
            <p className="text-muted-foreground text-lg">University of Data Analytics, 2019-2021</p>
          </div>
          <div>
            <h4 className="font-bold text-xl">Bachelor of Computer Science</h4>
            <p className="text-muted-foreground text-lg">Tech Institute of Computer Science, 2015-2019</p>
          </div>
        </div>
      )
    },
    {
      title: "Hobbies",
      icon: <HeartPulse className="h-7 w-7" />,
      content: (
        <div className="space-y-4">
          <p className="text-lg">When I'm not analyzing data, you can find me:</p>
          <ul className="list-disc list-inside space-y-2 text-lg">
            <li>Reading books on emerging technologies</li>
            <li>Playing chess and strategic board games</li>
            <li>Hiking and exploring nature trails</li>
            <li>Contributing to open-source data projects</li>
          </ul>
        </div>
      )
    }
  ];

  const prevCard = () => {
    setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const nextCard = () => {
    setActiveIndex((prev) => (prev + 1) % cards.length);
  };

  return (
    <section id="about" className="py-20 bg-secondary/30 dark:bg-secondary/10">
      <div className="section-container">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="mb-6 text-4xl">About</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-xl">
            Learn more about my background, education, and personal interests.
          </p>
        </div>

        <div className="relative">
          {/* Simple Card Carousel */}
          <div className="relative flex justify-center items-center h-[400px]">
            {cards.map((card, index) => (
              <AboutCard 
                key={index}
                title={card.title} 
                icon={card.icon}
                isActive={index === activeIndex}
              >
                {card.content}
              </AboutCard>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-center gap-8 mt-12">
            <button
              onClick={prevCard}
              className="p-4 rounded-full bg-secondary/70 hover:bg-secondary/90 dark:bg-secondary/40 dark:hover:bg-secondary/60 transition-colors shadow-md"
              aria-label="Previous card"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextCard}
              className="p-4 rounded-full bg-secondary/70 hover:bg-secondary/90 dark:bg-secondary/40 dark:hover:bg-secondary/60 transition-colors shadow-md"
              aria-label="Next card"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
