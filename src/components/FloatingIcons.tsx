
import { useEffect, useState } from 'react';
import { Code, Database, Server, Cpu, Monitor, Terminal, 
  Hash, GitBranch, Cloud, BrainCircuit, MousePointer, 
  PenTool, Network, Share2, Shield, Zap } from 'lucide-react';

interface Icon {
  component: React.ReactNode;
  position: { top: string; left: string };
  size: number;
  animation: string;
  rotation: string;
  opacity: number;
  color: string;
}

const techIcons = [
  Code, Database, Server, Cpu, Monitor, Terminal, 
  Hash, GitBranch, Cloud, BrainCircuit, MousePointer, 
  PenTool, Network, Share2, Shield, Zap
];

const FloatingIcons = () => {
  const [icons, setIcons] = useState<Icon[]>([]);
  
  useEffect(() => {
    const iconCount = Math.max(15, Math.min(25, Math.floor(window.innerWidth / 70)));
    const generatedIcons: Icon[] = [];
    
    const colors = [
      'text-primary', 'text-accent', 'text-blue-400', 'text-purple-400', 
      'text-indigo-400', 'text-violet-400'
    ];
    
    for (let i = 0; i < iconCount; i++) {
      const IconComponent = techIcons[i % techIcons.length];
      const rotationDegree = Math.floor(Math.random() * 360);
      
      generatedIcons.push({
        component: <IconComponent strokeWidth={1.5} />,
        position: {
          top: `${Math.random() * 95}%`,
          left: `${Math.random() * 95}%`,
        },
        size: Math.floor(Math.random() * 24) + 20, // 20px - 44px (bigger size)
        animation: [
          'animate-float', 
          'animate-float-slow',
          'animate-float-slower',
          'animate-float-horizontal'
        ][Math.floor(Math.random() * 4)],
        rotation: `rotate-${rotationDegree}`,
        opacity: Math.random() * 0.5 + 0.3, // 0.3 - 0.8 (more visible)
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    
    setIcons(generatedIcons);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {icons.map((icon, index) => (
        <div
          key={index}
          className={`absolute ${icon.animation} ${index % 3 === 0 ? 'animate-pulse-glow' : ''}`}
          style={{
            top: icon.position.top,
            left: icon.position.left,
            opacity: icon.opacity,
            transform: `rotate(${Math.random() * 360}deg)`,
            transition: 'all 0.5s ease',
            filter: 'drop-shadow(0 0 8px currentColor)',
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
