// src/components/genetic-art/ControlPanel.tsx
import React from "react";
import { Play, Pause, Save, RotateCcw } from "lucide-react";

interface ControlPanelProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
  isGenerating: boolean;
  onGenerationToggle: (isGenerating: boolean) => void;
  hasImage: boolean;
  settings: {
    numShapes: number;
    mutationRate: number;
    minSize: number;
    maxSize: number;
  };
  onSettingsChange: (settings: any) => void;
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
  settings,
  onSettingsChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-6">
      {/* Style Selection */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Settings</h2>
        <div className="space-y-4">
          {/* Number of Shapes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Shapes: {settings.numShapes}
            </label>
            <input
              type="range"
              min="50"
              max="1000"
              value={settings.numShapes}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  numShapes: parseInt(e.target.value),
                })
              }
              className="w-full"
              disabled={isGenerating}
            />
          </div>

          {/* Mutation Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mutation Rate: {(settings.mutationRate * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={settings.mutationRate * 100}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  mutationRate: parseInt(e.target.value) / 100,
                })
              }
              className="w-full"
              disabled={isGenerating}
            />
          </div>

          {/* Shape Size Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shape Size Range: {settings.minSize} - {settings.maxSize}
            </label>
            <div className="flex gap-2">
              <input
                type="range"
                min="1"
                max="50"
                value={settings.minSize}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    minSize: parseInt(e.target.value),
                  })
                }
                className="w-full"
                disabled={isGenerating}
              />
              <input
                type="range"
                min="10"
                max="100"
                value={settings.maxSize}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    maxSize: parseInt(e.target.value),
                  })
                }
                className="w-full"
                disabled={isGenerating}
              />
            </div>
          </div>
        </div>
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
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
