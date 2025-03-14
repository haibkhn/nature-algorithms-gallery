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
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-600">Average Speed</div>
          <div className="text-xl font-semibold">
            {stats.averageSpeed.toFixed(1)}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-600">Alignment</div>
          <div className="text-xl font-semibold">
            {(stats.averageAlignment * 100).toFixed(0)}%
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-600">Groups</div>
          <div className="text-xl font-semibold">{stats.groupCount}</div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-4 justify-center text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span>Alignment (% of boids moving together)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span>Number of distinct flocks</span>
        </div>
      </div>

      {/* History Graph */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-700 mb-4">
          Flock History
        </h3>
        <div className="h-32">
          <ResponsiveContainer>
            <LineChart data={historyData}>
              <XAxis
                dataKey="timestamp"
                domain={["auto", "auto"]}
                tick={false}
              />
              <YAxis yAxisId="left" domain={[0, 100]} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 10]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  border: "none",
                  borderRadius: "4px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
                formatter={(value, name) => {
                  if (name === "Alignment") return `${value.toFixed(0)}%`;
                  return value;
                }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="alignment"
                stroke="#3B82F6"
                dot={false}
                name="Alignment"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="groupCount"
                stroke="#22C55E"
                dot={false}
                name="Groups"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Patterns Description */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Current Patterns
        </h3>
        <div className="space-y-2 text-sm text-gray-600">
          {stats.groupCount === 1 ? (
            <p>The flock is moving as a single cohesive unit</p>
          ) : stats.groupCount <= 3 ? (
            <p>The flock has split into {stats.groupCount} distinct groups</p>
          ) : (
            <p>The flock is dispersed into multiple small groups</p>
          )}
          {stats.averageAlignment > 0.8 ? (
            <p>Boids are highly aligned, showing strong directional movement</p>
          ) : stats.averageAlignment > 0.5 ? (
            <p>Boids are moderately aligned with some variation in direction</p>
          ) : (
            <p>Boids are moving in various directions with low alignment</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
