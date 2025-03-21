
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
}

const techIcons = [
  Code, Database, Server, Cpu, Monitor, Terminal, 
  Hash, GitBranch, Cloud, BrainCircuit, MousePointer, 
  PenTool, Network, Share2, Shield, Zap
];

const FloatingIcons = () => {
  const [icons, setIcons] = useState<Icon[]>([]);
  
  useEffect(() => {
    const iconCount = Math.max(12, Math.min(20, Math.floor(window.innerWidth / 80)));
    const generatedIcons: Icon[] = [];
    
    for (let i = 0; i < iconCount; i++) {
      const IconComponent = techIcons[i % techIcons.length];
      const rotationDegree = Math.floor(Math.random() * 360);
      
      generatedIcons.push({
        component: <IconComponent strokeWidth={1.5} />,
        position: {
          top: `${Math.random() * 90}%`,
          left: `${Math.random() * 95}%`,
        },
        size: Math.floor(Math.random() * 20) + 16, // 16px - 36px
        animation: [
          'animate-float', 
          'animate-float-slow',
          'animate-float-slower',
          'animate-float-horizontal'
        ][Math.floor(Math.random() * 4)],
        rotation: `rotate-${rotationDegree}`,
        opacity: Math.random() * 0.4 + 0.2, // 0.2 - 0.6
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
          }}
        >
          <div 
            className={`text-primary dark:text-accent ${index % 5 === 0 ? 'animate-pulse-icon' : ''} ${index % 7 === 0 ? 'animate-rotate-slow' : ''}`} 
            style={{ width: icon.size, height: icon.size }}
          >
            {icon.component}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FloatingIcons;
