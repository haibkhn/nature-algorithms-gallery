// src/pages/Simulations.tsx
import React, { useState } from "react";
import GameOfLife from "../components/simulations/game-of-life";
import Boids from "../components/simulations/boids";
import AntColony from "../components/simulations/ant-colony";
import { SimulationMap } from "@/types/simulation";

interface Simulation {
  title: string;
  description: string;
  component: React.ComponentType | null;
  tags: string[];
}

const SIMULATIONS: SimulationMap = {
  gameOfLife: {
    title: "Conway's Game of Life",
    description:
      "A cellular automaton simulation where cells live or die based on their neighbors",
    component: GameOfLife,
    tags: ["Cellular Automata", "Evolution"],
  },
  boids: {
    title: "Boids Flocking",
    description:
      "Simulation of flocking behavior using Craig Reynolds' Boids algorithm",
    component: Boids,
    tags: ["Swarm Intelligence", "Movement"],
  },
  antColony: {
    title: "Ant Colony",
    description: "Ant colony optimization simulation",
    component: AntColony,
    tags: ["Pathfinding", "Swarm"],
  },
};

const Simulations: React.FC = () => {
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);
  const ActiveComponent = activeSimulation
    ? SIMULATIONS[activeSimulation].component
    : null;

  return (
    <div className="py-6">
      {!activeSimulation ? (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Nature Simulations</h1>
          <p className="text-gray-600 max-w-2xl">
            Explore various natural phenomena through interactive simulations.
            Each simulation demonstrates different aspects of natural systems
            and algorithms.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(SIMULATIONS).map(([key, sim]) => (
              <div
                key={key}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2">{sim.title}</h2>
                  <p className="text-gray-600 mb-4">{sim.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {sim.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    className={`px-4 py-2 rounded ${
                      sim.component
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                    onClick={() => sim.component && setActiveSimulation(key)}
                    disabled={!sim.component}
                  >
                    {sim.component ? "Start Simulation" : "Coming Soon"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">
              {SIMULATIONS[activeSimulation].title}
            </h1>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              onClick={() => setActiveSimulation(null)}
            >
              Back to All Simulations
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            {ActiveComponent && <ActiveComponent />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Simulations;
