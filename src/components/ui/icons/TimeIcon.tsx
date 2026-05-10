import React from 'react';

interface TimeIconProps {
  size?: string;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

const TimeIcon: React.FC<TimeIconProps> = ({ 
  size = "20px", 
  color = "currentColor", 
  strokeWidth = 2,
  className = "" 
}) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg"
      fill="none" 
      stroke={color} 
      strokeWidth={strokeWidth}
      viewBox="0 0 24 24"
      className={className}
      style={{ width: size, height: size }}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
      />
    </svg>
  );
};

export default TimeIcon;