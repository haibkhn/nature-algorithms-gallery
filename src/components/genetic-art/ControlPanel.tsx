import React from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { ArtSettings } from "../../types/settings";

interface ControlPanelProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
  isGenerating: boolean;
  onGenerationToggle: (isGenerating: boolean) => void;
  hasImage: boolean;
  settings: ArtSettings;
  onSettingsChange: (settings: ArtSettings) => void;
  onReset: () => void;
}

const STYLES = [
  {
    id: "geometric",
    name: "Geometric",
    description: "Generate art using triangles and polygons",
  },
  {
    id: "pointillism",
    name: "Pointillism",
    description: "Recreate image using small dots",
  },
  {
    id: "stained-glass",
    name: "Stained Glass",
    description: "Create a stained glass window effect",
  },
  {
    id: "mosaic",
    name: "Mosaic",
    description: "Transform into tile-based mosaic",
  },
];

const getShapeLimits = (style: string) => {
  switch (style) {
    case "stained-glass":
      return { min: 50, max: 5000 };
    case "geometric":
      return { min: 50, max: 5000 };
    case "mosaic":
      return { min: 100, max: 2000 };
    case "pointillism":
      return { min: 1000, max: 10000 };
    default:
      return { min: 50, max: 1000 };
  }
};

const ControlPanel: React.FC<ControlPanelProps> = ({
  selectedStyle,
  onStyleChange,
  isGenerating,
  onGenerationToggle,
  hasImage,
  settings,
  onSettingsChange,
  onReset,
}) => {
  const shapeLimits = getShapeLimits(selectedStyle);

  const handleNumShapesChange = (value: number) => {
    onSettingsChange({
      ...settings,
      numShapes: Math.min(Math.max(value, shapeLimits.min), shapeLimits.max),
    });
  };

  const renderStyleSettings = () => {
    const shapeName =
      selectedStyle === "stained-glass"
        ? "Panels"
        : selectedStyle === "mosaic"
        ? "Tiles"
        : selectedStyle === "pointillism"
        ? "Dots"
        : "Shapes";

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of {shapeName}: {settings.numShapes}
          </label>
          <input
            type="range"
            min={shapeLimits.min}
            max={shapeLimits.max}
            value={settings.numShapes}
            onChange={(e) => handleNumShapesChange(parseInt(e.target.value))}
            className="w-full"
            disabled={isGenerating}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {shapeName} Size Range: {settings.minSize} - {settings.maxSize}
          </label>
          <div className="flex gap-2">
            <input
              type="range"
              min={1}
              max={50}
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
              min={10}
              max={100}
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

        {settings.type === "stained-glass" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Border Width: {settings.borderWidth}px
            </label>
            <input
              type="range"
              min={1}
              max={5}
              value={settings.borderWidth}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  borderWidth: parseInt(e.target.value),
                })
              }
              className="w-full"
              disabled={isGenerating}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-6">
      {/* Style Selection */}
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
              disabled={isGenerating}
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
        {renderStyleSettings()}

        {/* Common settings for all styles */}
        <div className="mt-4">
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

          {/* Reset button */}
          <button
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 ${
              !hasImage || isGenerating ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={onReset}
            disabled={!hasImage || isGenerating}
          >
            <RotateCcw size={18} /> Reset Generation
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
