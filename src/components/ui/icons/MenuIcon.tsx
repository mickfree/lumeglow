import React from 'react';

interface MenuIconProps {
  size?: string;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

const MenuIcon: React.FC<MenuIconProps> = ({ 
  size = "24px", 
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
        d="M4 6h16M4 12h16M4 18h16" 
      />
    </svg>
  );
};

export default MenuIcon;