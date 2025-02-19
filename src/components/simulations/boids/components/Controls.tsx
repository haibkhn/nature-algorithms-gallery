// src/components/simulations/boids/components/Controls.tsx
import React, { useState } from "react";
import { Play, Pause, RefreshCw, Maximize2 } from "lucide-react";
import { ControlsProps, FlockingSettings } from "../types";

interface TooltipInfo {
  title: string;
  description: string;
}

const PARAMETER_INFO: Record<keyof FlockingSettings, TooltipInfo> = {
  alignmentForce: {
    title: "Alignment",
    description:
      "Boids will try to align their velocity with the average velocity of their neighbors",
  },
  cohesionForce: {
    title: "Cohesion",
    description:
      "Boids will try to move towards the average position of their neighbors",
  },
  separationForce: {
    title: "Separation",
    description:
      "Boids will try to maintain a minimum distance from their neighbors",
  },
  mouseForce: {
    title: "Mouse Force",
    description:
      "The force with which boids are attracted to or repelled from the mouse cursor",
  },
  mouseRadius: {
    title: "Mouse Radius",
    description:
      "The radius around the mouse cursor within which boids will be attracted to or repelled from it",
  },
  predatorForce: {
    title: "Predator Force",
    description:
      "The force with which predators chase nearby boids, causing them to flee",
  },
};

const Controls: React.FC<ControlsProps> = ({
  isRunning,
  onToggleRun,
  settings,
  onSettingsChange,
  onReset,
  onScatter,
  onShowTutorial,
}) => {
  const handleSettingChange = <K extends keyof FlockingSettings>(
    key: K,
    value: FlockingSettings[K]
  ) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Slider control component with safe value handling
  const Slider = ({
    label,
    value,
    onChange,
    min,
    max,
    step = 0.1,
    disabled = false,
    id,
    tooltip,
  }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step?: number;
    disabled?: boolean;
    id: string;
    tooltip?: TooltipInfo;
  }) => {
    const [hovered, setHovered] = useState(false);

    return (
      <div className="space-y-1 relative">
        {/* Wrap label + tooltip in a parent div for better hover detection */}
        <div
          className="relative flex justify-between items-center w-full"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Label on the left */}
          <label
            htmlFor={id}
            className="text-sm text-gray-600 cursor-help flex-1"
          >
            {label}
          </label>

          {/* Current value on the right */}
          <span className="text-sm font-mono text-gray-500 min-w-[40px] text-right">
            {(typeof value === "number" ? value : 0).toFixed(1)}
          </span>

          {/* Tooltip should only appear when hovered */}
          {hovered && tooltip && (
            <div className="absolute z-10 bg-black text-white text-sm rounded px-3 py-2 -top-12 left-1/2 transform -translate-x-1/2 w-max max-w-xs whitespace-normal break-words">
              {tooltip?.description ?? "No description available"}
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
            </div>
          )}
        </div>

        {/* Slider Input */}
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={typeof value === "number" ? value : 0}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          disabled={disabled}
          className="w-full"
          aria-label={label}
        />
      </div>
    );
  };

  // Early return if settings are not initialized
  if (!settings) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg border p-4 space-y-6">
      {/* Basic Controls */}
      <div className="space-y-4">
        <button
          className={`w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2 ${
            isRunning
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
          onClick={onToggleRun}
          aria-label={isRunning ? "Pause Simulation" : "Start Simulation"}
        >
          {isRunning ? (
            <>
              <Pause size={18} /> Pause Simulation
            </>
          ) : (
            <>
              <Play size={18} /> Start Simulation
            </>
          )}
        </button>

        <div className="flex gap-2">
          <button
            className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center justify-center gap-2"
            onClick={onReset}
            aria-label="Reset Simulation"
          >
            <RefreshCw size={18} /> Reset
          </button>
          <button
            className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center justify-center gap-2"
            onClick={onScatter}
            aria-label="Scatter Boids"
          >
            <Maximize2 size={18} /> Scatter
          </button>
        </div>
      </div>

      {/* Simulation Controls */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">Simulation Controls</h3>

        {/* Add Number of Boids Slider */}
        <Slider
          id="num-boids"
          label="Number of Boids"
          value={settings.numberOfBoids}
          onChange={(value) => handleSettingChange("numberOfBoids", value)}
          min={10}
          max={200}
          step={1}
          disabled={isRunning}
        />

        {/* Flocking Parameters */}
        <h3 className="font-semibold text-gray-700">Flocking Parameters</h3>
        <Slider
          id="alignment"
          label="Alignment"
          value={settings.alignmentForce}
          onChange={(value) => handleSettingChange("alignmentForce", value)}
          min={0}
          max={2}
          disabled={isRunning}
          tooltip={PARAMETER_INFO.alignmentForce}
        />

        <Slider
          id="cohesion-force"
          label="Cohesion Force"
          value={settings.cohesionForce}
          onChange={(value) => handleSettingChange("cohesionForce", value)}
          min={0}
          max={2}
          disabled={isRunning}
          tooltip={PARAMETER_INFO.cohesionForce}
        />

        <Slider
          id="separation-force"
          label="Separation Force"
          value={settings.separationForce}
          onChange={(value) => handleSettingChange("separationForce", value)}
          min={0}
          max={2}
          disabled={isRunning}
          tooltip={PARAMETER_INFO.separationForce}
        />
      </div>

      {/* Mouse Interaction Controls */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">Mouse Interaction</h3>
        <div
          className="flex gap-2"
          role="radiogroup"
          aria-label="Mouse interaction mode"
        >
          <button
            className={`flex-1 px-3 py-2 rounded-lg ${
              settings.mouseInteraction === "none"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => handleSettingChange("mouseInteraction", "none")}
            aria-pressed={settings.mouseInteraction === "none"}
          >
            None
          </button>
          <button
            className={`flex-1 px-3 py-2 rounded-lg ${
              settings.mouseInteraction === "attract"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => handleSettingChange("mouseInteraction", "attract")}
            aria-pressed={settings.mouseInteraction === "attract"}
          >
            Attract
          </button>
          <button
            className={`flex-1 px-3 py-2 rounded-lg ${
              settings.mouseInteraction === "repel"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => handleSettingChange("mouseInteraction", "repel")}
            aria-pressed={settings.mouseInteraction === "repel"}
          >
            Repel
          </button>
        </div>

        <Slider
          id="mouse-force"
          label="Mouse Force"
          value={settings.mouseForce}
          onChange={(value) => handleSettingChange("mouseForce", value)}
          min={0}
          max={2}
          disabled={settings.mouseInteraction === "none" || isRunning}
          tooltip={PARAMETER_INFO.mouseForce}
        />

        <Slider
          id="mouse-radius"
          label="Mouse Radius"
          value={settings.mouseRadius}
          onChange={(value) => handleSettingChange("mouseRadius", value)}
          min={20}
          max={200}
          step={1}
          disabled={settings.mouseInteraction === "none" || isRunning}
          tooltip={PARAMETER_INFO.mouseRadius}
        />
      </div>

      {/* Predator Controls */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">Predators</h3>
        <Slider
          id="num-predators"
          label="Number of Predators"
          value={settings.numberOfPredators}
          onChange={(value) => handleSettingChange("numberOfPredators", value)}
          min={0}
          max={5}
          step={1}
          disabled={isRunning}
        />

        <Slider
          id="predator-force"
          label="Predator Force"
          value={settings.predatorForce}
          onChange={(value) => handleSettingChange("predatorForce", value)}
          min={0}
          max={2}
          disabled={settings.numberOfPredators === 0 || isRunning}
          tooltip={PARAMETER_INFO.predatorForce}
        />
      </div>

      {/* Info Cards */}
      <div className="space-y-2 text-sm text-gray-600">
        <div className="p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-700 mb-1">Mouse Interaction</h4>
          <p>Boids will be attracted to or repelled from your mouse cursor</p>
        </div>
        <div className="p-3 bg-red-50 rounded-lg">
          <h4 className="font-medium text-red-700 mb-1">Predators</h4>
          <p>Red triangles will chase nearby boids, causing them to flee</p>
        </div>
      </div>

      <button
        onClick={onShowTutorial}
        className="w-full px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
      >
        Show Tutorial
      </button>
    </div>
  );
};

export default Controls;
