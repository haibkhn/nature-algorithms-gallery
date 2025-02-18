import React from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { StatsPanelProps } from "../types";

const StatsPanel: React.FC<StatsPanelProps> = ({
  generation,
  liveCells,
  populationHistory,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 text-sm">
        <span className="font-medium">Generation: {generation}</span>
        <span className="font-medium">Live Cells: {liveCells}</span>
      </div>

      <div className="h-32">
        <ResponsiveContainer>
          <LineChart data={populationHistory}>
            <XAxis dataKey="generation" />
            <YAxis />
            <Line
              type="monotone"
              dataKey="population"
              stroke="#8884d8"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatsPanel;
