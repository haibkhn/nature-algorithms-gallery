// src/components/genetic-art/ArtDisplay.tsx
import React, { useRef, useState, useEffect } from "react";
import { MoveHorizontal, ZoomIn, ZoomOut } from "lucide-react";

interface ArtDisplayProps {
  originalImage: string | null;
  generatedImage: string | null;
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
  stats: {
    generation: number;
    fitness: number;
    shapes: number;
  };
}

const ArtDisplay: React.FC<ArtDisplayProps> = ({
  originalImage,
  generatedImage,
  onCanvasReady,
  stats,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [compareMode, setCompareMode] = useState<"side-by-side" | "slider">(
    "side-by-side"
  );
  const [sliderPosition, setSliderPosition] = useState(50);
  const [zoom, setZoom] = useState(1);

  // Initialize canvas when component mounts
  useEffect(() => {
    if (canvasRef.current) {
      onCanvasReady(canvasRef.current);
    }
  }, [onCanvasReady]);

  if (!originalImage) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Upload an image to get started
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Display Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded ${
              compareMode === "side-by-side" ? "bg-blue-100" : "bg-gray-100"
            }`}
            onClick={() => setCompareMode("side-by-side")}
          >
            Side by Side
          </button>
          <button
            className={`px-3 py-1 rounded ${
              compareMode === "slider" ? "bg-blue-100" : "bg-gray-100"
            }`}
            onClick={() => setCompareMode("slider")}
          >
            Slider
          </button>
        </div>
        <div className="flex gap-2">
          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
          >
            <ZoomOut size={20} />
          </button>
          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
          >
            <ZoomIn size={20} />
          </button>
        </div>
      </div>

      {/* Canvas and Image Display */}
      <div className="flex-1 relative border rounded-lg overflow-hidden bg-gray-50">
        {/* Hidden canvas for generation */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Visible display */}
        {compareMode === "side-by-side" ? (
          <div className="flex h-full">
            <div className="flex-1 border-r relative overflow-hidden">
              <img
                src={originalImage}
                alt="Original"
                className="w-full h-full object-contain"
                style={{ transform: `scale(${zoom})` }}
              />
            </div>
            <div className="flex-1 relative overflow-hidden">
              {generatedImage ? (
                <img
                  src={generatedImage}
                  alt="Generated"
                  className="w-full h-full object-contain"
                  style={{ transform: `scale(${zoom})` }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Generation will appear here
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="relative h-full">
            {/* Original Image */}
            <img
              src={originalImage}
              alt="Original"
              className="w-full h-full object-contain"
              style={{ transform: `scale(${zoom})` }}
            />

            {/* Generated Art with Clip */}
            {generatedImage && (
              <div
                className="absolute top-0 left-0 h-full overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src={generatedImage}
                  alt="Generated"
                  className="w-full h-full object-contain"
                  style={{ transform: `scale(${zoom})` }}
                />
              </div>
            )}

            {/* Slider Control */}
            <div className="absolute top-0 left-0 w-full h-full">
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="absolute top-1/2 left-0 w-full"
              />
              <div
                className="absolute top-0 w-1 h-full bg-blue-500 cursor-ew-resize"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow">
                  <MoveHorizontal size={16} className="text-blue-500" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Generation Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="text-center">
          <div className="text-sm text-gray-600">Generation</div>
          <div className="text-xl font-semibold">{stats.generation}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">Fitness</div>
          <div className="text-xl font-semibold">
            {stats.fitness ? (stats.fitness * 100).toFixed(1) : 0}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">Shapes</div>
          <div className="text-xl font-semibold">{stats.shapes}</div>
        </div>
      </div>
    </div>
  );
};

export default ArtDisplay;
