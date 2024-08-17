import React, { useEffect, useRef, useState } from 'react';

interface SVGPreviewProps {
  code: string;
}

const SVGPreview: React.FC<SVGPreviewProps> = ({ code }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgElements, setSvgElements] = useState<SVGSVGElement[]>([]);
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (containerRef.current) {
      try {
        containerRef.current.innerHTML = code;
        const svgs = Array.from(containerRef.current.querySelectorAll('svg')) as SVGSVGElement[];
        setSvgElements(svgs);

        svgs.forEach((svg, index) => {
          const containerWidth = containerRef.current!.clientWidth;
          const containerHeight = containerRef.current!.clientHeight;
          const viewBox = svg.viewBox.baseVal;

          const scaleX = containerWidth / viewBox.width;
          const scaleY = containerHeight / viewBox.height;
          const newScale = Math.min(scaleX, scaleY) * 0.95;

          setScale(newScale);
          setPosition({ x: 0, y: 0 });

          svg.setAttribute('width', `${viewBox.width}`);
          svg.setAttribute('height', `${viewBox.height}`);
          svg.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
          svg.style.transform = `translate(0, ${index * (viewBox.height * newScale + 10)}px) scale(${newScale})`;
          svg.style.transformOrigin = '0 0';
        });
      } catch (error) {
        console.error('SVGコードのパース中にエラーが発生しました:', error);
        setSvgElements([]);
      }
    }
  }, [code]);

  const handleZoom = (zoomIn: boolean) => {
    setScale((prevScale) => {
      const newScale = zoomIn ? prevScale * 1.2 : prevScale / 1.2;
      const clampedScale = Math.max(0.1, Math.min(newScale, 15));
      svgElements.forEach((svg, index) => {
        svg.style.transform = `translate(${position.x}px, ${position.y + index * (svg.viewBox.baseVal.height * clampedScale + 10)}px) scale(${clampedScale})`;
        svg.style.transformOrigin = '0 0';
      });
      return clampedScale;
    });
  };

  const handleResetZoom = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      const viewBox = svgElements[0]?.viewBox.baseVal;

      if (viewBox) {
        const scaleX = containerWidth / viewBox.width;
        const scaleY = containerHeight / viewBox.height;
        const newScale = Math.min(scaleX, scaleY) * 0.95;

        setScale(newScale);
        setPosition({ x: 0, y: 0 });

        svgElements.forEach((svg, index) => {
          svg.style.transform = `translate(0, ${index * (viewBox.height * newScale + 10)}px) scale(${newScale})`;
          svg.style.transformOrigin = '0 0';
        });
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    setStartPosition({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    const newPosition = { x: e.clientX - startPosition.x, y: e.clientY - startPosition.y };
    setPosition(newPosition);
    svgElements.forEach((svg, index) => {
      svg.style.transform = `translate(${newPosition.x}px, ${newPosition.y + index * (svg.viewBox.baseVal.height * scale + 10)}px) scale(${scale})`;
      svg.style.transformOrigin = '0 0';
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    handleZoom(e.deltaY < 0);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-2 flex flex-wrap justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => handleZoom(false)} 
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Zoom Out
          </button>
          <button 
            onClick={() => handleZoom(true)} 
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Zoom In
          </button>
        </div>
        <button 
          onClick={handleResetZoom} 
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Reset Zoom
        </button>
      </div>
      <div
        ref={containerRef}
        className="flex-grow overflow-auto p-4 border rounded dark:border-gray-700 dark:bg-gray-900"
        style={{ minHeight: '300px', cursor: dragging ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />
    </div>
  );
};

export default SVGPreview;
