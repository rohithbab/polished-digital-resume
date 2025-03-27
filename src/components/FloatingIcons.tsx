import { useEffect, useState } from 'react';
import { 
  Code, Database, Server, Cpu, Monitor, Terminal, 
  Hash, GitBranch, Cloud, BrainCircuit, MousePointer, 
  PenTool, Network, Share2, Shield, Zap, Star, Sparkle,
  Binary, CircuitBoard, Microchip, HardDrive,
  Wifi, Radio, Smartphone, Laptop, Tablet
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
  PenTool, Network, Share2, Shield, Zap, Star, Sparkle,
  Binary, CircuitBoard, Microchip, HardDrive,
  Wifi, Radio, Smartphone, Laptop, Tablet
];

const FloatingIcons = () => {
  const [icons, setIcons] = useState<Icon[]>([]);
  
  useEffect(() => {
    // Create more icons for a denser effect
    const iconCount = Math.max(30, Math.min(50, Math.floor(window.innerWidth / 40)));
    const generatedIcons: Icon[] = [];
    
    const colors = [
      'text-primary/80', 'text-accent/80', 'text-blue-400/80', 'text-purple-400/80', 
      'text-indigo-400/80', 'text-violet-400/80', 'text-cyan-400/80', 'text-emerald-400/80',
      'text-rose-400/80', 'text-amber-400/80'
    ];
    
    for (let i = 0; i < iconCount; i++) {
      const IconComponent = techIcons[i % techIcons.length];
      
      generatedIcons.push({
        component: <IconComponent strokeWidth={1.5} />,
        position: {
          top: `${Math.random() * -100}%`,
          left: `${Math.random() * 100}%`,
        },
        size: Math.floor(Math.random() * 40) + 24, // 24px - 64px
        opacity: Math.random() * 0.7 + 0.3, // 0.3 - 1.0
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 40 + 30 // 30s - 70s falling duration
      });
    }
    
    setIcons(generatedIcons);

    // Create a continuous effect of falling icons
    const interval = setInterval(() => {
      setIcons(prev => {
        return prev.map(icon => {
          if (parseFloat(icon.position.top) > 110) {
            return {
              ...icon,
              position: {
                top: `${Math.random() * -50}%`,
                left: `${Math.random() * 100}%`,
              },
              size: Math.floor(Math.random() * 40) + 24,
              opacity: Math.random() * 0.7 + 0.3,
              color: colors[Math.floor(Math.random() * colors.length)],
              speed: Math.random() * 40 + 30
            };
          }
          
          return {
            ...icon,
            position: {
              ...icon.position,
              top: `${parseFloat(icon.position.top) + 0.2}%`, // Even slower movement
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
            filter: 'drop-shadow(0 0 15px currentColor)',
            zIndex: -1
          }}
        >
          <div 
            className={`${icon.color} ${index % 5 === 0 ? 'animate-pulse-icon' : ''} ${index % 7 === 0 ? 'animate-rotate-slow' : ''}`} 
            style={{ 
              width: icon.size, 
              height: icon.size,
              filter: 'drop-shadow(0 0 12px currentColor)',
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
