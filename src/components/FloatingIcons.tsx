
import { useEffect, useState } from 'react';
import { 
  Code, Database, Server, Cpu, Monitor, Terminal, 
  Hash, GitBranch, Cloud, BrainCircuit, MousePointer, 
  PenTool, Network, Share2, Shield, Zap, Star, Sparkle
} from 'lucide-react';

interface Icon {
  component: React.ReactNode;
  position: { top: string; left: string };
  size: number;
  animation: string;
  opacity: number;
  color: string;
  speed: number;
}

const techIcons = [
  Code, Database, Server, Cpu, Monitor, Terminal, 
  Hash, GitBranch, Cloud, BrainCircuit, MousePointer, 
  PenTool, Network, Share2, Shield, Zap, Star, Sparkle
];

const FloatingIcons = () => {
  const [icons, setIcons] = useState<Icon[]>([]);
  
  useEffect(() => {
    // Create more icons for a denser effect
    const iconCount = Math.max(25, Math.min(40, Math.floor(window.innerWidth / 50)));
    const generatedIcons: Icon[] = [];
    
    const colors = [
      'text-primary', 'text-accent', 'text-blue-400', 'text-purple-400', 
      'text-indigo-400', 'text-violet-400', 'text-cyan-400'
    ];
    
    for (let i = 0; i < iconCount; i++) {
      const IconComponent = techIcons[i % techIcons.length];
      
      generatedIcons.push({
        component: <IconComponent strokeWidth={1.5} />,
        position: {
          // Start icons from above the visible area for better falling effect
          top: `${Math.random() * -50}%`,
          left: `${Math.random() * 98}%`,
        },
        size: Math.floor(Math.random() * 24) + 16, // 16px - 40px
        animation: `falling-${Math.floor(Math.random() * 4) + 1}`,
        opacity: Math.random() * 0.4 + 0.4, // 0.4 - 0.8 (more visible)
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 20 + 10 // 10s - 30s falling duration
      });
    }
    
    setIcons(generatedIcons);

    // Create a continuous effect of falling icons
    const interval = setInterval(() => {
      setIcons(prev => {
        return prev.map(icon => {
          // If icon has fallen below the view, reset it to the top
          if (parseFloat(icon.position.top) > 100) {
            return {
              ...icon,
              position: {
                top: `${Math.random() * -20}%`, // Start slightly above the viewport
                left: `${Math.random() * 98}%`,
              }
            };
          }
          
          // Move the icon down
          return {
            ...icon,
            position: {
              ...icon.position,
              top: `${parseFloat(icon.position.top) + 0.2}%`,
            }
          };
        });
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {icons.map((icon, index) => (
        <div
          key={index}
          className={`absolute transition-all`}
          style={{
            top: icon.position.top,
            left: icon.position.left,
            opacity: icon.opacity,
            animation: `fallDown ${icon.speed}s linear infinite`,
            filter: 'drop-shadow(0 0 8px currentColor)',
            transition: 'all 0.5s ease',
          }}
        >
          <div 
            className={`${icon.color} ${index % 5 === 0 ? 'animate-pulse-icon' : ''} ${index % 7 === 0 ? 'animate-rotate-slow' : ''}`} 
            style={{ 
              width: icon.size, 
              height: icon.size,
              filter: 'drop-shadow(0 0 5px currentColor)',
            }}
          >
            {icon.component}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FloatingIcons;
