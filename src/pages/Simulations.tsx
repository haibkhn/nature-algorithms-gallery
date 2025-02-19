import React, { useState } from "react";
import { Grid, Wind, Bug, ChevronLeft } from "lucide-react";
import GameOfLife from "../components/simulations/game-of-life";
import Boids from "../components/simulations/boids";
import AntColony from "../components/simulations/ant-colony";
import { SimulationMap } from "@/types/simulation";

interface Simulation {
  title: string;
  description: string;
  component: React.ComponentType | null;
  tags: string[];
  icon: React.ReactNode;
}

const SIMULATIONS: SimulationMap = {
  gameOfLife: {
    title: "Conway's Game of Life",
    description:
      "A cellular automaton simulation where cells live or die based on their neighbors",
    component: GameOfLife,
    tags: ["Cellular Automata", "Evolution"],
    icon: <Grid className="w-6 h-6" />, // Grid icon represents cellular grid
  },
  boids: {
    title: "Boids Flocking",
    description:
      "Simulation of flocking behavior using Craig Reynolds' Boids algorithm",
    component: Boids,
    tags: ["Swarm Intelligence", "Movement"],
    icon: <Wind className="w-6 h-6" />, // Wind icon suggests flowing movement like flocking
  },
  antColony: {
    title: "Ant Colony",
    description:
      "Ant colony optimization simulation demonstrating emergent path-finding behavior",
    component: AntColony,
    tags: ["Pathfinding", "Swarm"],
    icon: <Bug className="w-6 h-6" />, // Bug icon represents ants
  },
};

const Simulations: React.FC = () => {
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);
  const ActiveComponent = activeSimulation
    ? SIMULATIONS[activeSimulation].component
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-6">
      {!activeSimulation ? (
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Nature Simulations
            </h1>
            <p className="text-lg text-gray-600">
              Explore various natural phenomena through interactive simulations.
              Each simulation demonstrates different aspects of natural systems
              and algorithms.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(SIMULATIONS).map(([key, sim]) => (
              <div
                key={key}
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                      {sim.icon}
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {sim.title}
                    </h2>
                  </div>

                  <p className="text-gray-600 mb-6 min-h-[60px]">
                    {sim.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {sim.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    className={`w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                      sim.component
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
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
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6 mb-8">
            <button
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              onClick={() => setActiveSimulation(null)}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back to All Simulations</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-800">
              {SIMULATIONS[activeSimulation].title}
            </h1>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            {ActiveComponent && <ActiveComponent />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Simulations;
