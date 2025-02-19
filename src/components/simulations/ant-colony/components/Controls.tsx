// src/components/simulations/ant-colony/components/Controls.tsx
import React, { useState } from "react";
import { Play, Pause, RefreshCw, Eraser } from "lucide-react";
import { ControlsProps, AntColonySettings } from "../types";

interface TooltipInfo {
  title: string;
  description: string;
}

const PARAMETER_INFO: Record<keyof AntColonySettings, TooltipInfo> = {
  type: { title: "Type", description: "Simulation type identifier" },
  numberOfAnts: {
    title: "Number of Ants",
    description:
      "Total ants in the colony. More ants find food faster but require more processing.",
  },
  pheromoneStrength: {
    title: "Pheromone Strength",
    description:
      "Intensity of pheromone trails. Higher values make paths more defined but less adaptable.",
  },
  pheromoneEvaporation: {
    title: "Evaporation Rate",
    description:
      "How quickly pheromones fade. Higher rates help forget old paths but require stronger trails.",
  },
  antSpeed: {
    title: "Ant Speed",
    description:
      "Movement speed of ants. Faster ants cover more ground but might miss optimal paths.",
  },
  sensorDistance: {
    title: "Sensor Distance",
    description:
      "How far ants can detect pheromones. Larger values help find trails but may make paths less precise.",
  },
  sensorAngle: {
    title: "Sensor Angle",
    description:
      "Width of ant's pheromone detection arc. Wider angles help find trails but make paths more chaotic.",
  },
  foodAmount: {
    title: "Food Amount",
    description:
      "Amount of food at each food source. Higher values allow longer-lasting trails.",
  },
};

const Controls: React.FC<ControlsProps> = ({
  isRunning,
  onToggleRun,
  settings,
  onSettingsChange,
  onReset,
  onClear,
  mode,
  onModeChange,
  onShowTutorial,
}) => {
  const handleSettingChange = <K extends keyof AntColonySettings>(
    key: K,
    value: AntColonySettings[K]
  ) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Slider control component with tooltip
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
            {(typeof value === "number" ? value : 0).toFixed(2)}
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
            className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center justify-center gap-2"
            onClick={onClear}
            aria-label="Clear Food and Obstacles"
          >
            <Eraser size={18} /> Clear
          </button>
        </div>
      </div>

      {/* Mode Selection with tooltips */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-700">Placement Mode</h3>
        <div
          className="flex gap-2"
          role="radiogroup"
          aria-label="Placement mode"
        >
          <button
            className={`flex-1 px-3 py-2 rounded-lg relative ${
              mode === "none"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => onModeChange("none")}
            onMouseEnter={() => setActiveTooltip("mode-none")}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            None
            {activeTooltip === "mode-none" && (
              <div className="absolute z-10 bg-black text-white text-sm rounded px-2 py-1 -top-12 left-1/2 transform -translate-x-1/2 w-max">
                Disable placement mode
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
              </div>
            )}
          </button>
          <button
            className={`flex-1 px-3 py-2 rounded-lg relative ${
              mode === "food"
                ? "bg-green-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => onModeChange("food")}
            onMouseEnter={() => setActiveTooltip("mode-food")}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            Food
            {activeTooltip === "mode-food" && (
              <div className="absolute z-10 bg-black text-white text-sm rounded px-2 py-1 -top-12 left-1/2 transform -translate-x-1/2 w-max">
                Click to place food sources
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
              </div>
            )}
          </button>
          <button
            className={`flex-1 px-3 py-2 rounded-lg relative ${
              mode === "obstacle"
                ? "bg-gray-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => onModeChange("obstacle")}
            onMouseEnter={() => setActiveTooltip("mode-wall")}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            Wall
            {activeTooltip === "mode-wall" && (
              <div className="absolute z-10 bg-black text-white text-sm rounded px-2 py-1 -top-12 left-1/2 transform -translate-x-1/2 w-max">
                Click to toggle walls
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Colony Parameters */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">Colony Parameters</h3>

        <Slider
          id="num-ants"
          label="Number of Ants"
          value={settings.numberOfAnts}
          onChange={(value) => handleSettingChange("numberOfAnts", value)}
          min={10}
          max={200}
          step={1}
          disabled={isRunning}
          tooltip={PARAMETER_INFO.numberOfAnts}
        />

        <Slider
          id="ant-speed"
          label="Ant Speed"
          value={settings.antSpeed}
          onChange={(value) => handleSettingChange("antSpeed", value)}
          min={0.5}
          max={2}
          disabled={isRunning}
          tooltip={PARAMETER_INFO.antSpeed}
        />

        <Slider
          id="pheromone-strength"
          label="Pheromone Strength"
          value={settings.pheromoneStrength}
          onChange={(value) => handleSettingChange("pheromoneStrength", value)}
          min={0.1}
          max={2}
          disabled={isRunning}
          tooltip={PARAMETER_INFO.pheromoneStrength}
        />

        <Slider
          id="pheromone-evaporation"
          label="Evaporation Rate"
          value={settings.pheromoneEvaporation}
          onChange={(value) =>
            handleSettingChange("pheromoneEvaporation", value)
          }
          min={0.001}
          max={0.1}
          step={0.001}
          disabled={isRunning}
          tooltip={PARAMETER_INFO.pheromoneEvaporation}
        />

        <Slider
          id="sensor-distance"
          label="Sensor Distance"
          value={settings.sensorDistance}
          onChange={(value) => handleSettingChange("sensorDistance", value)}
          min={10}
          max={50}
          step={1}
          disabled={isRunning}
          tooltip={PARAMETER_INFO.sensorDistance}
        />

        <Slider
          id="sensor-angle"
          label="Sensor Angle"
          value={settings.sensorAngle * (180 / Math.PI)}
          onChange={(value) =>
            handleSettingChange("sensorAngle", value * (Math.PI / 180))
          }
          min={15}
          max={90}
          step={1}
          disabled={isRunning}
          tooltip={PARAMETER_INFO.sensorAngle}
        />
      </div>

      {/* Info Cards */}
      <div className="space-y-2 text-sm text-gray-600">
        <div className="p-3 bg-green-50 rounded-lg">
          <h4 className="font-medium text-green-700 mb-1">Food Sources</h4>
          <p>Click to place food for ants to collect</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-1">Obstacles</h4>
          <p>Create walls to test path finding</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-700 mb-1">Pheromones</h4>
          <p>Watch ants create optimal paths through pheromone trails</p>
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
