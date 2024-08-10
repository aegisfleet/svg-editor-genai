import React, { useEffect, useRef, useState } from 'react';

interface SVGPreviewProps {
  code: string;
}

const SVGPreview: React.FC<SVGPreviewProps> = ({ code }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = code;
      const svg = containerRef.current.querySelector('svg');
      if (svg) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        const svgWidth = svg.viewBox.baseVal.width || svg.width.baseVal.value;
        const svgHeight = svg.viewBox.baseVal.height || svg.height.baseVal.value;

        const scaleX = containerWidth / svgWidth;
        const scaleY = containerHeight / svgHeight;
        const newScale = Math.min(scaleX, scaleY);

        setScale(newScale);
        svg.style.width = `${svgWidth * newScale}px`;
        svg.style.height = `${svgHeight * newScale}px`;
      }
    }
  }, [code]);

  return (
    <div 
      ref={containerRef} 
      className="flex-grow p-4 border rounded-lg bg-white overflow-hidden flex items-center justify-center" 
      style={{ minHeight: '300px' }}
    />
  );
};

export default SVGPreview;
