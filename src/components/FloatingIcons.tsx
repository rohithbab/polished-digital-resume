
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
    const iconCount = Math.max(40, Math.min(60, Math.floor(window.innerWidth / 40)));
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
          top: `${Math.random() * -100}%`, // Start further above viewport
          left: `${Math.random() * 100}%`,
        },
        size: Math.floor(Math.random() * 28) + 18, // 18px - 46px (larger)
        opacity: Math.random() * 0.5 + 0.5, // 0.5 - 1.0 (more visible)
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 25 + 15 // 15s - 40s falling duration
      });
    }
    
    setIcons(generatedIcons);

    // Create a continuous effect of falling icons
    const interval = setInterval(() => {
      setIcons(prev => {
        return prev.map(icon => {
          // If icon has fallen below the view, reset it to the top
          if (parseFloat(icon.position.top) > 110) {
            return {
              ...icon,
              position: {
                top: `${Math.random() * -50}%`, // Start well above the viewport
                left: `${Math.random() * 100}%`,
              },
              // Randomize the appearance for variety
              size: Math.floor(Math.random() * 28) + 18,
              opacity: Math.random() * 0.5 + 0.5,
              color: colors[Math.floor(Math.random() * colors.length)],
              speed: Math.random() * 25 + 15
            };
          }
          
          // Move the icon down
          return {
            ...icon,
            position: {
              ...icon.position,
              top: `${parseFloat(icon.position.top) + 0.4}%`, // Faster movement
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
          className={`absolute ${index % 2 === 0 ? 'animate-fallDown' : 'animate-fallDownWiggle'}`}
          style={{
            top: icon.position.top,
            left: icon.position.left,
            opacity: icon.opacity,
            animationDuration: `${icon.speed}s`,
            filter: 'drop-shadow(0 0 10px currentColor)',
            zIndex: -5
          }}
        >
          <div 
            className={`${icon.color} ${index % 5 === 0 ? 'animate-pulse-icon' : ''} ${index % 7 === 0 ? 'animate-rotate-slow' : ''}`} 
            style={{ 
              width: icon.size, 
              height: icon.size,
              filter: 'drop-shadow(0 0 8px currentColor)',
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
