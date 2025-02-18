// src/components/genetic-art/ArtDisplay.tsx
import React, { useState } from "react";
import { MoveHorizontal, ZoomIn, ZoomOut } from "lucide-react";

interface ArtDisplayProps {
  originalImage: string | null;
  generatedArt: string | null;
}

const ArtDisplay: React.FC<ArtDisplayProps> = ({
  originalImage,
  generatedArt,
}) => {
  const [compareMode, setCompareMode] = useState<"side-by-side" | "slider">(
    "side-by-side"
  );
  const [sliderPosition, setSliderPosition] = useState(50);

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
      <div className="flex justify-between mb-4">
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
          <button className="p-1 hover:bg-gray-100 rounded">
            <ZoomOut size={20} />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <ZoomIn size={20} />
          </button>
        </div>
      </div>

      {/* Image Display */}
      <div className="flex-1 relative border rounded-lg overflow-hidden">
        {compareMode === "side-by-side" ? (
          <div className="flex h-full">
            <div className="flex-1 border-r">
              <img
                src={originalImage}
                alt="Original"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1">
              {generatedArt ? (
                <img
                  src={generatedArt}
                  alt="Generated"
                  className="w-full h-full object-contain"
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
            />

            {/* Generated Art with Clip */}
            {generatedArt && (
              <div
                className="absolute top-0 left-0 h-full overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src={generatedArt}
                  alt="Generated"
                  className="w-full h-full object-contain"
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
      {generatedArt && (
        <div className="mt-4 flex justify-between text-sm text-gray-600">
          <div>Generation: 42</div>
          <div>Fitness: 85%</div>
          <div>Shapes: 150</div>
        </div>
      )}
    </div>
  );
};

export default ArtDisplay;
