import React from "react";
import { Info } from "lucide-react";
import { ControlsProps } from "../types";
import { SCENARIOS } from "../constants/scenarios";

const Controls: React.FC<ControlsProps> = ({
  isRunning,
  onToggleRun,
  onClear,
  onRandom,
  speed,
  onSpeedChange,
  onSelectScenario,
  onShowHelp,
}) => {
  return (
    <div className="bg-white rounded-lg border p-4">
      {/* Basic Controls */}
      <div className="space-y-4">
        <button
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={onToggleRun}
        >
          {isRunning ? "Stop" : "Start"}
        </button>

        <div className="flex gap-2">
          <button
            className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={onClear}
          >
            Clear
          </button>
          <button
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={onRandom}
          >
            Random
          </button>
          <button
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            onClick={onShowHelp}
          >
            <Info size={20} />
          </button>
        </div>
      </div>

      {/* Speed Control */}
      <div className="mt-6 space-y-2">
        <label className="text-sm text-gray-600">
          Speed: {Math.round(1000 / speed)} fps
        </label>
        <input
          type="range"
          min="50"
          max="500"
          value={500 - speed}
          onChange={(e) => onSpeedChange(500 - Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Scenarios */}
      <div className="mt-6 space-y-2">
        <h3 className="font-semibold">Scenarios</h3>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-2">
          {Object.entries(SCENARIOS).map(([key, scenario]) => (
            <button
              key={key}
              className="w-full px-3 py-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
              onClick={() => onSelectScenario(key)}
            >
              <div className="font-medium">{scenario.name}</div>
              <div className="text-xs text-gray-600">
                {scenario.description}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Controls;
