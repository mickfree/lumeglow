import React from 'react';

interface EyeIconProps {
  size?: string;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

const EyeIcon: React.FC<EyeIconProps> = ({ 
  size = "20px", 
  color = "currentColor", 
  strokeWidth = 2,
  className = "" 
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ width: size, height: size }}
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
};

export default EyeIcon;