import React from 'react';

interface ArrowLeftIconProps {
  size?: string;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

const ArrowLeftIcon: React.FC<ArrowLeftIconProps> = ({ 
  size = "20px", 
  color = "currentColor", 
  strokeWidth = 2,
  className = "" 
}) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke={color}
      className={className}
      style={{ width: size, height: size }}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={strokeWidth} 
        d="M15 19l-7-7 7-7" 
      />
    </svg>
  );
};

export default ArrowLeftIcon;