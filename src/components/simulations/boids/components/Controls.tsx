// src/components/simulations/boids/components/Controls.tsx
import React from "react";
import { Play, Pause, RefreshCw, Maximize2 } from "lucide-react";
import { ControlsProps, FlockingSettings } from "../types";

const Controls: React.FC<ControlsProps> = ({
  isRunning,
  onToggleRun,
  settings,
  onSettingsChange,
  onReset,
  onScatter,
}) => {
  const handleSettingChange = (key: keyof FlockingSettings, value: number) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  // Slider control component
  const Slider = ({
    label,
    value,
    onChange,
    min,
    max,
    step = 0.1,
    disabled = false,
  }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step?: number;
    disabled?: boolean;
  }) => (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <label className="text-sm text-gray-600">{label}</label>
        <span className="text-sm font-mono text-gray-500">
          {value.toFixed(1)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        disabled={disabled}
        className="w-full"
      />
    </div>
  );

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
          >
            <RefreshCw size={18} /> Reset
          </button>
          <button
            className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center justify-center gap-2"
            onClick={onScatter}
          >
            <Maximize2 size={18} /> Scatter
          </button>
        </div>
      </div>

      {/* Flocking Parameters */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">Flocking Parameters</h3>

        <Slider
          label="Alignment Force"
          value={settings.alignmentForce}
          onChange={(value) => handleSettingChange("alignmentForce", value)}
          min={0}
          max={2}
          disabled={isRunning}
        />

        <Slider
          label="Cohesion Force"
          value={settings.cohesionForce}
          onChange={(value) => handleSettingChange("cohesionForce", value)}
          min={0}
          max={2}
          disabled={isRunning}
        />

        <Slider
          label="Separation Force"
          value={settings.separationForce}
          onChange={(value) => handleSettingChange("separationForce", value)}
          min={0}
          max={2}
          disabled={isRunning}
        />

        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-700 mb-4">
            Advanced Settings
          </h3>

          <Slider
            label="Number of Boids"
            value={settings.numberOfBoids}
            onChange={(value) => handleSettingChange("numberOfBoids", value)}
            min={10}
            max={200}
            step={1}
            disabled={isRunning}
          />

          <Slider
            label="Visual Range"
            value={settings.visualRange}
            onChange={(value) => handleSettingChange("visualRange", value)}
            min={20}
            max={100}
            step={1}
            disabled={isRunning}
          />

          <Slider
            label="Separation Range"
            value={settings.separationRange}
            onChange={(value) => handleSettingChange("separationRange", value)}
            min={10}
            max={50}
            step={1}
            disabled={isRunning}
          />

          <Slider
            label="Max Speed"
            value={settings.maxSpeed}
            onChange={(value) => handleSettingChange("maxSpeed", value)}
            min={1}
            max={10}
            step={0.5}
            disabled={isRunning}
          />

          <Slider
            label="Max Force"
            value={settings.maxForce}
            onChange={(value) => handleSettingChange("maxForce", value)}
            min={0.1}
            max={1}
            step={0.05}
            disabled={isRunning}
          />
        </div>
      </div>

      {/* Info Cards */}
      <div className="space-y-2 text-sm text-gray-600">
        <div className="p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-700 mb-1">Alignment</h4>
          <p>Steers boids to align with neighbors' direction</p>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <h4 className="font-medium text-green-700 mb-1">Cohesion</h4>
          <p>Attracts boids toward the center of nearby flockmates</p>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg">
          <h4 className="font-medium text-purple-700 mb-1">Separation</h4>
          <p>Keeps boids from crowding too close together</p>
        </div>
      </div>
    </div>
  );
};

export default Controls;
