import React from 'react';

interface AuroraProps {
  colorStops?: string[];
  blend?: number;
  amplitude?: number;
  speed?: number;
}

export const Aurora: React.FC<AuroraProps> = ({
  colorStops = ["#3A29FF", "#FF94B4", "#FF3232"],
  blend = 0.5,
  amplitude = 1.0,
  speed = 0.5
}) => {
  const animationDuration = `${20 / speed}s`;
  
  return (
    <div className="aurora-container">
      <div 
        className="aurora-gradient"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 40%, ${colorStops[0]}${Math.round(blend * 100).toString(16).padStart(2, '0')} 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 60%, ${colorStops[1]}${Math.round(blend * 100).toString(16).padStart(2, '0')} 0%, transparent 50%),
            radial-gradient(ellipse 100% 80% at 40% 20%, ${colorStops[2]}${Math.round(blend * 100).toString(16).padStart(2, '0')} 0%, transparent 50%)
          `,
          animationDuration,
          transform: `scale(${amplitude})`
        }}
      />
      <div 
        className="aurora-gradient aurora-gradient-2"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 60% 80%, ${colorStops[1]}${Math.round(blend * 80).toString(16).padStart(2, '0')} 0%, transparent 50%),
            radial-gradient(ellipse 90% 50% at 10% 30%, ${colorStops[2]}${Math.round(blend * 80).toString(16).padStart(2, '0')} 0%, transparent 50%),
            radial-gradient(ellipse 50% 70% at 90% 10%, ${colorStops[0]}${Math.round(blend * 80).toString(16).padStart(2, '0')} 0%, transparent 50%)
          `,
          animationDuration: `${30 / speed}s`,
          transform: `scale(${amplitude * 0.8})`
        }}
      />
    </div>
  );
};

export default Aurora;