
import { useEffect, useState } from 'react';
import { Code, Database, Server, Cpu, Monitor, Terminal, 
  Hash, GitBranch, Cloud, AlertCircle, MousePointer, 
  PenTool, Network, Share2, Shield, Zap } from 'lucide-react';

interface Icon {
  component: React.ReactNode;
  position: { top: string; left: string };
  size: number;
  animation: string;
  opacity: number;
}

const techIcons = [
  Code, Database, Server, Cpu, Monitor, Terminal, 
  Hash, GitBranch, Cloud, AlertCircle, MousePointer, 
  PenTool, Network, Share2, Shield, Zap
];

const FloatingIcons = () => {
  const [icons, setIcons] = useState<Icon[]>([]);
  
  useEffect(() => {
    const iconCount = Math.max(10, Math.min(16, Math.floor(window.innerWidth / 100)));
    const generatedIcons: Icon[] = [];
    
    for (let i = 0; i < iconCount; i++) {
      const IconComponent = techIcons[i % techIcons.length];
      generatedIcons.push({
        component: <IconComponent />,
        position: {
          top: `${Math.random() * 90}%`,
          left: `${Math.random() * 95}%`,
        },
        size: Math.floor(Math.random() * 16) + 14, // 14px - 30px
        animation: [
          'animate-float', 
          'animate-float-slow', 
          'animate-float-slower'
        ][Math.floor(Math.random() * 3)],
        opacity: Math.random() * 0.15 + 0.05, // 0.05 - 0.2
      });
    }
    
    setIcons(generatedIcons);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {icons.map((icon, index) => (
        <div
          key={index}
          className={`absolute ${icon.animation}`}
          style={{
            top: icon.position.top,
            left: icon.position.left,
            opacity: icon.opacity,
          }}
        >
          <div className="text-primary dark:text-accent" style={{ width: icon.size, height: icon.size }}>
            {icon.component}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FloatingIcons;
