// src/components/genetic-art/ControlPanel.tsx
import React from "react";
import { Play, Pause, Save, RotateCcw } from "lucide-react";

interface ControlPanelProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
  isGenerating: boolean;
  onGenerationToggle: (isGenerating: boolean) => void;
  hasImage: boolean;
}

const STYLES = [
  {
    id: "geometric",
    name: "Geometric",
    description: "Generate art using triangles and polygons",
  },
  {
    id: "stained-glass",
    name: "Stained Glass",
    description: "Create a stained glass window effect",
  },
  {
    id: "pointillism",
    name: "Pointillism",
    description: "Recreate image using small dots",
  },
  {
    id: "mosaic",
    name: "Mosaic",
    description: "Transform into tile-based mosaic",
  },
  {
    id: "brush-strokes",
    name: "Brush Strokes",
    description: "Paint-like brush strokes effect",
  },
];

const ControlPanel: React.FC<ControlPanelProps> = ({
  selectedStyle,
  onStyleChange,
  isGenerating,
  onGenerationToggle,
  hasImage,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-6">
      {/* Styles Selection */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Art Style</h2>
        <div className="space-y-2">
          {STYLES.map((style) => (
            <button
              key={style.id}
              className={`w-full p-3 text-left rounded-lg transition-colors ${
                selectedStyle === style.id
                  ? "bg-blue-50 border border-blue-200"
                  : "hover:bg-gray-50 border border-transparent"
              }`}
              onClick={() => onStyleChange(style.id)}
            >
              <div className="font-medium">{style.name}</div>
              <div className="text-sm text-gray-600">{style.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Style-specific Settings */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Settings</h2>
        {/* Brush Strokes Settings */}
        {selectedStyle === "brush-strokes" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Strokes
              </label>
              <input type="range" min="50" max="1000" className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Stroke Length
              </label>
              <input type="range" min="10" max="100" className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stroke Width Range
              </label>
              <div className="flex gap-2">
                <input type="range" min="1" max="20" className="w-full" />
                <input type="range" min="5" max="40" className="w-full" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Curvature
              </label>
              <input type="range" min="0" max="100" className="w-full" />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input type="checkbox" className="rounded" />
                Follow Edge Direction
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input type="checkbox" className="rounded" />
                Use Image Colors
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brush Style
              </label>
              <select className="w-full rounded border-gray-300">
                <option value="round">Round</option>
                <option value="flat">Flat</option>
                <option value="textured">Textured</option>
                <option value="calligraphy">Calligraphy</option>
              </select>
            </div>
          </div>
        )}
        {selectedStyle === "geometric" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Shapes
              </label>
              <input
                type="range"
                min="50"
                max="500"
                className="w-full"
                // Add value and onChange handlers
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mutation Rate
              </label>
              <input
                type="range"
                min="1"
                max="100"
                className="w-full"
                // Add value and onChange handlers
              />
            </div>
          </div>
        )}
        {/* Add more style-specific settings */}
      </div>

      {/* Generation Controls */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Controls</h2>
        <div className="flex flex-col gap-2">
          <button
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${
              hasImage
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            onClick={() => onGenerationToggle(!isGenerating)}
            disabled={!hasImage}
          >
            {isGenerating ? (
              <>
                <Pause size={18} /> Pause Generation
              </>
            ) : (
              <>
                <Play size={18} /> Start Generation
              </>
            )}
          </button>
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-50"
            disabled={!hasImage}
          >
            <Save size={18} /> Save Result
          </button>
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-50"
            disabled={!hasImage}
          >
            <RotateCcw size={18} /> Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
