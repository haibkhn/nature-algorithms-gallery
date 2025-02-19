// src/components/simulations/ant-colony/components/StatsPanel.tsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { StatsPanelProps } from "../types";

const StatsPanel: React.FC<StatsPanelProps> = ({ stats, historyData }) => {
  return (
    <div className="space-y-4">
      {/* Current Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-600">Food Collected</div>
          <div className="text-xl font-semibold">{stats.foodCollected}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-600">Active Ants</div>
          <div className="text-xl font-semibold">{stats.activeAnts}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-600">Avg Path Length</div>
          <div className="text-xl font-semibold">
            {stats.averagePathLength.toFixed(1)}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-600">Pheromone Level</div>
          <div className="text-xl font-semibold">
            {stats.totalPheromoneIntensity.toFixed(1)}
          </div>
        </div>
      </div>

      {/* History Graph */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-700 mb-4">
          Colony Performance
        </h3>
        <div className="h-32">
          <ResponsiveContainer>
            <LineChart data={historyData}>
              <XAxis
                dataKey="timestamp"
                domain={["auto", "auto"]}
                tick={false}
              />
              <YAxis
                yAxisId="food"
                orientation="left"
                stroke="#059669"
                domain={[0, "auto"]}
              />
              <YAxis
                yAxisId="path"
                orientation="right"
                stroke="#6366F1"
                domain={[0, "auto"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  border: "none",
                  borderRadius: "4px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              />
              <Line
                yAxisId="food"
                type="monotone"
                dataKey="foodCollected"
                stroke="#059669"
                dot={false}
                name="Food Collected"
              />
              <Line
                yAxisId="path"
                type="monotone"
                dataKey="avgPathLength"
                stroke="#6366F1"
                dot={false}
                name="Avg Path Length"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Colony Analysis */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Colony Analysis
        </h3>
        <div className="space-y-2 text-sm text-gray-600">
          {stats.foodCollected === 0 ? (
            <p>Waiting for ants to find and collect food...</p>
          ) : stats.averagePathLength > 50 ? (
            <p>
              Ants are exploring widely. Consider adjusting pheromone strength
              to optimize paths.
            </p>
          ) : stats.averagePathLength < 20 && stats.foodCollected > 10 ? (
            <p>Colony has established efficient paths to food sources!</p>
          ) : (
            <p>Ants are actively foraging and establishing pheromone trails.</p>
          )}

          {stats.totalPheromoneIntensity > 100 ? (
            <p>
              Strong pheromone trails are present. Paths are well-established.
            </p>
          ) : stats.totalPheromoneIntensity < 20 ? (
            <p>
              Weak pheromone trails. Ants may need more time to establish paths.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
