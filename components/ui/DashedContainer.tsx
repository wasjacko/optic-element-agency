import React from 'react';

interface DashedContainerProps {
  children: React.ReactNode;
  className?: string;
  width?: "sm" | "md" | "lg" | "full";
  noBorderTop?: boolean;
  noBorderBottom?: boolean;
  showSpine?: boolean;
  lightMode?: boolean;
}

export const DashedContainer: React.FC<DashedContainerProps> = ({ 
  children, 
  className = "",
  width = "lg",
  noBorderTop = false,
  noBorderBottom = false,
  showSpine = false,
  lightMode = false
}) => {
  const maxWidthClass = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-7xl",
    full: "max-w-full"
  }[width];

  const borderColor = lightMode ? "border-black/10" : "border-white/10";
  const crosshairColor = lightMode ? "text-black/30" : "text-white/30";

  return (
    <div className={`relative w-full ${maxWidthClass} mx-auto px-6 ${className}`}>
      {/* Top Border */}
      {!noBorderTop && (
        <div className={`absolute top-0 left-6 right-6 h-px border-t border-dashed ${borderColor}`} />
      )}
      
      {/* Bottom Border */}
      {!noBorderBottom && (
        <div className={`absolute bottom-0 left-6 right-6 h-px border-b border-dashed ${borderColor}`} />
      )}
      
      {/* Central Spine */}
      {showSpine && (
        <div className={`absolute top-0 bottom-0 left-1/2 w-px border-l border-dashed ${borderColor} -translate-x-1/2 hidden md:block`} />
      )}

      {/* Technical Crosshairs at corners instead of thick borders */}
      <div className={`absolute top-0 left-6 -translate-x-1/2 -translate-y-1/2 ${crosshairColor} font-mono text-[10px]`}>+</div>
      <div className={`absolute top-0 right-6 translate-x-1/2 -translate-y-1/2 ${crosshairColor} font-mono text-[10px]`}>+</div>
      <div className={`absolute bottom-0 left-6 -translate-x-1/2 translate-y-1/2 ${crosshairColor} font-mono text-[10px]`}>+</div>
      <div className={`absolute bottom-0 right-6 translate-x-1/2 translate-y-1/2 ${crosshairColor} font-mono text-[10px]`}>+</div>

      <div className="relative z-10 py-12 md:py-20">
        {children}
      </div>
    </div>
  );
};