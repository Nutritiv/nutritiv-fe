import React from 'react'

export const CloseIcon = (props) => {
  const { color, strokeWidth, width, height } = props;
  
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-6 w-6" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke={color} 
      strokeWidth={strokeWidth}
      height={height || "100%"}
      width={width || "100%"}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12" 
      />
    </svg>
  )
}