
import { useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, GraduationCap, HeartPulse } from 'lucide-react';

const cards = [
  {
    id: 'about',
    title: 'About Me',
    icon: <BookOpen className="h-6 w-6" />,
    content: (
      <div>
        <p className="mb-4">
          I'm a passionate Data Analyst with expertise in transforming complex datasets into actionable insights. 
          With a strong foundation in statistical analysis and data visualization, I help organizations make data-driven decisions.
        </p>
        <p>
          My approach combines technical expertise with business acumen to deliver meaningful results that drive growth and efficiency.
        </p>
      </div>
    ),
  },
  {
    id: 'education',
    title: 'Education',
    icon: <GraduationCap className="h-6 w-6" />,
    content: (
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
    ),
  },
  {
    id: 'hobbies',
    title: 'Hobbies',
    icon: <HeartPulse className="h-6 w-6" />,
    content: (
      <div className="space-y-3">
        <p>When I'm not analyzing data, you can find me:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Reading books on emerging technologies</li>
          <li>Playing chess and strategic board games</li>
          <li>Hiking and exploring nature trails</li>
          <li>Contributing to open-source data projects</li>
        </ul>
      </div>
    ),
  },
];

const About = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextCard = () => {
    setActiveIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
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

        <div className="flex justify-center">
          <div className="relative w-full max-w-2xl">
            <div className="glass-card p-8 animate-scale-in">
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 dark:bg-accent/10 p-2 rounded-md mr-3">
                  {cards[activeIndex].icon}
                </div>
                <h3 className="text-2xl font-bold">{cards[activeIndex].title}</h3>
              </div>
              <div className="min-h-[200px]">
                {cards[activeIndex].content}
              </div>
              <div className="flex justify-between mt-6 pt-4 border-t border-border">
                <button
                  onClick={prevCard}
                  className="p-2 rounded-full hover:bg-secondary/80 dark:hover:bg-secondary/40 transition-colors"
                  aria-label="Previous card"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex space-x-2">
                  {cards.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === activeIndex
                          ? 'bg-primary dark:bg-accent'
                          : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                      }`}
                      aria-label={`Go to card ${idx + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextCard}
                  className="p-2 rounded-full hover:bg-secondary/80 dark:hover:bg-secondary/40 transition-colors"
                  aria-label="Next card"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
