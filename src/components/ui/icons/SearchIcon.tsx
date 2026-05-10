import React from 'react';

interface SearchIconProps {
  size?: string;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

const SearchIcon: React.FC<SearchIconProps> = ({ 
  size = "16px", 
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
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
};

export default SearchIcon;