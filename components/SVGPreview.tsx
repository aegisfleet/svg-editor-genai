import React, { useEffect, useRef, useState } from 'react';

interface SVGPreviewProps {
  code: string;
}

const SVGPreview: React.FC<SVGPreviewProps> = ({ code }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = code;
      const svg = containerRef.current.querySelector('svg');
      if (svg) {
        svgRef.current = svg as SVGSVGElement;

        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        const viewBox = svg.viewBox.baseVal;

        const scaleX = containerWidth / viewBox.width;
        const scaleY = containerHeight / viewBox.height;
        const newScale = Math.min(scaleX, scaleY) * 0.95;

        setScale(newScale);
        setPosition({ x: 0, y: 0 });

        svg.setAttribute('width', `${viewBox.width}`);
        svg.setAttribute('height', `${viewBox.height}`);
        svg.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
        svg.style.transform = `translate(0, 0) scale(${newScale})`;
        svg.style.transformOrigin = '0 0';
      }
    }
  }, [code]);

  const handleZoom = (zoomIn: boolean) => {
    if (svgRef.current) {
      setScale((prevScale) => {
        const newScale = zoomIn ? prevScale * 1.2 : prevScale / 1.2;
        const clampedScale = Math.max(0.1, Math.min(newScale, 15));
        svgRef.current!.style.transform = `translate(${position.x}px, ${position.y}px) scale(${clampedScale})`;
        svgRef.current!.style.transformOrigin = '0 0';
        return clampedScale;
      });
    }
  };

  const handleResetZoom = () => {
    if (svgRef.current) {
      const containerWidth = containerRef.current?.clientWidth || 1;
      const containerHeight = containerRef.current?.clientHeight || 1;
      const viewBox = svgRef.current?.viewBox.baseVal;

      if (viewBox) {
        const scaleX = containerWidth / viewBox.width;
        const scaleY = containerHeight / viewBox.height;
        const newScale = Math.min(scaleX, scaleY) * 0.95;

        setScale(newScale);
        setPosition({ x: 0, y: 0 });

        svgRef.current!.style.transform = `translate(0, 0) scale(${newScale})`;
        svgRef.current!.style.transformOrigin = '0 0';
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    setStartPosition({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !svgRef.current) return;
    const newPosition = { x: e.clientX - startPosition.x, y: e.clientY - startPosition.y };
    setPosition(newPosition);
    svgRef.current!.style.transform = `translate(${newPosition.x}px, ${newPosition.y}px) scale(${scale})`;
    svgRef.current!.style.transformOrigin = '0 0';
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
      <div className="mb-2 flex justify-between">
        <div>
          <button 
            onClick={() => handleZoom(false)} 
            className="mr-2 px-4 py-2 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition-colors"
          >
            Zoom Out
          </button>
          <button 
            onClick={() => handleZoom(true)} 
            className="px-4 py-2 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition-colors"
          >
            Zoom In
          </button>
        </div>
        <div>
          <button 
            onClick={handleResetZoom} 
            className="px-4 py-2 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition-colors"
          >
            Reset Zoom
          </button>
        </div>
      </div>
      <div
        ref={containerRef}
        className="flex-grow overflow-auto p-4 border rounded"
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
