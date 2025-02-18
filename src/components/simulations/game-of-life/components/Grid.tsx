// src/components/simulations/game-of-life/components/Grid.tsx
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Maximize2, MousePointer, MousePointerClick, Move } from "lucide-react";
import { GridProps } from "../types";

export interface GridHandle {
  centerGrid: () => void;
}

const Grid = forwardRef<GridHandle, GridProps>(({ grid, toggleCell }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cellSize] = useState(20);
  // Add state for helper visibility
  const [showHelper, setShowHelper] = useState(true); // Show by default, auto-hide after a while

  // Auto-hide helper after 10 seconds
  useEffect(() => {
    if (showHelper) {
      const timer = setTimeout(() => {
        setShowHelper(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showHelper]);

  // Function to constrain position within grid boundaries
  const constrainPosition = useCallback(
    (pos: { x: number; y: number }, currentScale: number) => {
      if (!containerRef.current) return pos;

      const container = containerRef.current;
      const gridWidth = grid[0].length * cellSize * currentScale;
      const gridHeight = grid.length * cellSize * currentScale;

      // Calculate boundaries to keep grid visible
      const minX = Math.min(0, container.clientWidth - gridWidth);
      const maxX = 0;
      const minY = Math.min(0, container.clientHeight - gridHeight);
      const maxY = 0;

      return {
        x: Math.max(minX, Math.min(maxX, pos.x)),
        y: Math.max(minY, Math.min(maxY, pos.y)),
      };
    },
    [grid, cellSize]
  );

  // Center grid function
  const centerGrid = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const gridWidth = grid[0].length * cellSize;
    const gridHeight = grid.length * cellSize;

    // Calculate scale to fit grid in view with padding
    const padding = 40;
    const scaleX = (container.clientWidth - padding) / gridWidth;
    const scaleY = (container.clientHeight - padding) / gridHeight;
    const newScale = Math.min(1, scaleX, scaleY);

    // Calculate position to center
    const scaledGridWidth = gridWidth * newScale;
    const scaledGridHeight = gridHeight * newScale;
    const newX = (container.clientWidth - scaledGridWidth) / 2;
    const newY = (container.clientHeight - scaledGridHeight) / 2;

    setScale(newScale);
    setPosition({ x: newX, y: newY });
  }, [grid, cellSize]);

  // Only center on initial mount
  useEffect(() => {
    centerGrid();
  }, []); // Empty dependency array = only run once on mount

  // Expose centerGrid method through ref
  useImperativeHandle(
    ref,
    () => ({
      centerGrid,
    }),
    [centerGrid]
  );

  // Handle mouse wheel for zooming
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      // Get mouse position relative to container
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Calculate zoom
      const delta = e.deltaY;
      const oldScale = scale;
      const newScale =
        delta > 0 ? Math.max(0.5, oldScale - 0.1) : Math.min(3, oldScale + 0.1);

      // Adjust position to zoom around mouse point
      const scaleChange = newScale / oldScale;
      const newX = mouseX - (mouseX - position.x) * scaleChange;
      const newY = mouseY - (mouseY - position.y) * scaleChange;

      setScale(newScale);
      setPosition(constrainPosition({ x: newX, y: newY }, newScale));
    },
    [scale, position, constrainPosition]
  );

  // Handle mouse events for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || e.button === 2) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newPosition = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      };
      setPosition(constrainPosition(newPosition, scale));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add wheel event listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [handleWheel]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden relative cursor-move"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        className="absolute"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: "0 0",
        }}
      >
        {/* Main grid container with background */}
        <div
          className="grid gap-[1px] bg-gray-100"
          style={{
            gridTemplateColumns: `repeat(${grid[0].length}, ${cellSize}px)`,
            width: `${grid[0].length * cellSize}px`,
            height: `${grid.length * cellSize}px`,
          }}
        >
          {grid.map((row, i) =>
            row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCell(i, j);
                }}
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                }}
                className={`
                  transition-colors duration-200 
                  ${cell ? "bg-blue-500" : "bg-white"}
                  hover:bg-blue-200
                `}
              />
            ))
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={() => setShowHelper(true)}
          className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-100"
          title="Show controls"
        >
          ?
        </button>
        <button
          onClick={centerGrid}
          className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-100"
          title="Center grid"
        >
          <Maximize2 size={18} />
        </button>
        <button
          onClick={() => {
            const newScale = Math.min(3, scale + 0.1);
            setScale(newScale);
            setPosition(constrainPosition(position, newScale));
          }}
          className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-100"
        >
          +
        </button>
        <button
          onClick={() => {
            const newScale = Math.max(0.5, scale - 0.1);
            setScale(newScale);
            setPosition(constrainPosition(position, newScale));
          }}
          className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-100"
        >
          -
        </button>
      </div>
      {/* Helper Overlay */}
      {showHelper && (
        <div className="absolute top-4 left-4 bg-white/90 p-4 rounded-lg shadow-lg max-w-xs">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg">Controls</h3>
            <button
              onClick={() => setShowHelper(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <MousePointerClick size={16} className="text-blue-500" />
              <span>Left click to toggle cells</span>
            </div>
            <div className="flex items-center gap-2">
              <Move size={16} className="text-blue-500" />
              <span>Right click + drag to pan</span>
            </div>
            <div className="flex items-center gap-2">
              <MousePointer size={16} className="text-blue-500" />
              <span>Mouse wheel to zoom</span>
            </div>
            <div className="flex items-center gap-2">
              <Maximize2 size={16} className="text-blue-500" />
              <span>Click center button to fit view</span>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            This helper will auto-hide in a few seconds
          </div>
        </div>
      )}
    </div>
  );
});

export default Grid;
